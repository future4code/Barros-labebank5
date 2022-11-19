import express,{Request,Response} from "express"

import cors from 'cors'

import * as data from "./data"

import validarCpf from "./validaCpf"

import * as func from "./functions"

const app = express()

app.use(express.json())

app.use(cors())

app.get("/users",(req:Request, res: Response)=>{
    res.send(data.client)
})

app.post("/users/newUser",(req:Request, res: Response)=>{
    let errCode = 400
    try {
        const {nome,cpf,dataNasc} = req.body
        if (!nome||!cpf||!dataNasc) {
            errCode = 402
            throw new Error("Verification params body, nome, cpf and birthdate")
        }
        const cpfValidity = validarCpf(cpf);
        if (!cpfValidity) {
            errCode = 402
            throw new Error("Verification params cpf is not valid")
        }
        const ageLager = func.validityAge(dataNasc)
        if(ageLager<18){
            errCode = 402
            throw new Error("the age of less than 18 years")

        }
        const existUser = data.client.find((user)=> user.cpf === cpf)
        if (existUser) {
            errCode = 402
            throw new Error("User already exist")
        }
        const addNewUser = func.addUser(data.client,nome,cpf,dataNasc)
        res.status(200).send(addNewUser);
    } catch (error:any) {
        res.status(errCode).send(error.message)
    }
})

//--------------------CONTA A PAGAR

app.post("/users/account/pay",(req:Request, res: Response)=>{
    let errCode = 400
     try {
         const {valor,dataPagamento,descricao,cpf} = req.body
        
         if (!descricao||!valor||!cpf) {
             errCode = 402
             throw new Error("Verification params body, data, descricao, valor and cpf")
         }
           const cpfValidity = validarCpf(cpf); 
         if (!cpfValidity) {
             errCode = 402
             throw new Error("Verification params cpf is not valid")
         } 
         const existUser = data.client.find((user)=> user.cpf === cpf) 
         if (!existUser) {
             errCode = 402
             throw new Error("User already not exist")
         }
         const balanceCompare = func.validiBalance(data.client,cpf,valor)
        if(balanceCompare){
             errCode = 402
             throw new Error("insufficient balance.")
         }
         const isValidiDate = func.validiDate(dataPagamento)
         if(!isValidiDate&&dataPagamento !== ""){
             errCode = 402
             throw new Error("data pagamento is not valid")
         }
         
         const addPayAccount = func.addMovementAccount(data.client,dataPagamento, descricao, valor,cpf)
         res.status(200).send(addPayAccount);
 
     } catch (error:any) {
         res.status(errCode).send(error.message)
     }
 })

// ---------------- ADICIONAR SALDO
app.put('/users/addSaldo',(req:Request, res: Response)=>{
    try{
        const nome = req.headers.nome 
        const cpf= req.headers.cpf
        const addSaldo = req.body.saldo
        let dataDeposito:string="";
        if( !nome ){
            const erro=new Error("Nome não informado!");
            erro.name="nomeNaoInformado";
            throw erro;
        }
        if( !cpf ){
            const erro=new Error('CPF não informado')
            erro.name="cpfNaoInformado"
            throw erro
        }
        if( !addSaldo ){
            const erro=new Error('Saldo não informado')
            erro.name="saldoNaoInformado"
            throw erro
        }

        const addPayAccount = func.addMovementAccount(data.client,dataDeposito, "Deposito de dinheiro", addSaldo,cpf.toString())
        
        const buscaUser = data.client.filter((i)=>{
            if(cpf === i.cpf){
                let nSaldo = i.saldo + addSaldo
                i.saldo = nSaldo
            }
        })
        
        res.status(200).send(data.client);

    }catch(erro:any){
        res.status(400).send(erro.message);
    }
})

//------------------ VER Saldo
app.get('/users/verSaldo', (req:Request, res: Response) =>{
    try {
        const nome = req.headers.nome 
        const cpf = req.headers.cpf

        if(!nome){
            const erro=new Error("Nome não informado!")
            erro.name="nomeNaoInformado";
            throw erro;
        }

        if(!cpf){
            const erro=new Error('CPF não informado')
            erro.name="cpfNaoInformado"
            throw erro
        }
        
        const existUser = data.client.find((user)=> {
           return user.cpf === cpf
            
        })

        if(!existUser){
            const erro=new Error('Usuário não existe')
            erro.name="cpfInvalido"
            throw erro
        }
        
        const buscaUser = data.client.filter((i)=>{
            if(cpf === i.cpf){
                return i.saldo
            }
        })
        const verSaldo = buscaUser.map((saldo)=>{
            return saldo.saldo
        })
        res.status(200).send(verSaldo);

    }
    catch(erro:any){
        res.status(400).send(erro.message);
    }
})

// -------------------TRANSFERÊNCIA INTERNA
app.put('/users/transferencia',(req:Request, res: Response)=>{
    try{
        const nomeRemetente = req.headers.nome 
        const cpfRemetente = req.headers.cpf
        const nomeDestinatario = req.body.nomeDestinatario
        const cpfDestinatario = req.body.cpfDestinatario
        const valorTransferencia = req.body.valorTransferencia

        if( !nomeRemetente ){
            const erro=new Error("Nome do remetente não informado!");
            erro.name="nomeNaoInformado";
            throw erro;
        }
        if( !cpfRemetente ){
            const erro=new Error("CPF do remetente não informado!");
            erro.name="cpfNaoInformado";
            throw erro;
        }
        if( !nomeDestinatario ){
            const erro=new Error("Nome do destinatário não informado!");
            erro.name="nomeDestinatarioNaoInformado";
            throw erro;
        }
        if( !cpfDestinatario ){
            const erro=new Error("CPF do destinatário não informado!");
            erro.name="cpfDestinatarioNaoInformado";
            throw erro;
        }
        if( !valorTransferencia ){
            const erro=new Error("Valor não informado!");
            erro.name="valorNaoInformado";
            throw erro;
        }

        const buscaRemetente = data.client.filter((i)=>{
            return cpfRemetente === i.cpf
        })
        const buscaDestinatario = data.client.filter((i)=>{
            return cpfDestinatario === i.cpf
        })
        const t = buscaRemetente.map((i)=>{
            if(valorTransferencia < i.saldo){
                const transferencia = buscaDestinatario.map((i)=>{
                    let nSaldo = i.saldo + valorTransferencia
                    i.saldo = nSaldo
                })
                i.saldo - valorTransferencia
            }else{
                const erro=new Error("Saldo insuficiente!");
                erro.name="saldoInsuficiente";
                throw erro;
            }
        })
        res.status(200).send(data.client)
        
    }catch(erro:any){
        res.status(400).send(erro.message);
    }
})

//---------------- SALDO ATUALIZADO
app.put('/users/atualizaSaldo', (req:Request, res: Response) => {
    try {
        const nome = req.params.nome
        const cpf = req.headers.cpf

        if(!cpf){
            const erro=new Error("CPF não informado!");
            erro.name="cpfNaoInformado";
            throw erro;
        }

        const existUser = data.client.find((user)=> {
            return user.cpf === cpf
             
         })
 
         if(!existUser){
             const erro=new Error('Usuário não existe')
             erro.name="cpfInvalido"
             throw erro
         }
         
        const buscaUser = data.client.filter((i)=>{
           return i.cpf === cpf
        })
        console.log(cpf);
        
        const validiDateExtract = (dateAccount:any):boolean=>{
            let parts = dateAccount.split('-')
            let today = new Date()
            dateAccount = new Date(parts[0], parts[1] - 1, parts[2])
            return dateAccount <= today ? true : false
        }

        let soma = 0
        for (let i = 0; i < buscaUser[0].extratos.length; i++) {
            const dataValida = validiDateExtract(buscaUser[0].extratos[i].data)
            if(dataValida){
                soma += buscaUser[0].extratos[i].valor;
            }
        }

        buscaUser[0].saldo = buscaUser[0].saldo - soma

        res.status(200).send(buscaUser)

    }
    catch(erro:any){
        res.status(400).send(erro.message);
    }
})

app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});