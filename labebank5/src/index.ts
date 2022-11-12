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

// ---------------- ADICIONAR SALDO
app.put('/users/addSaldo',(req:Request, res: Response)=>{
    try{
        const nome = req.headers.nome 
        const cpf= req.headers.cpf
        const addSaldo = req.body.saldo
        
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

//ver saldo
app.get('/users/verSaldo', (req:Request, res: Response) =>{
    try {
        const nome = req.headers.nome 
        const cpf= req.headers.cpf
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


app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});