import { client} from "./data";
import * as types from "./type";


export const addUser = (client: types.Conta[], nome: string, cpf: string, dataNasc: string):types.Conta[] => {
  const newUser = [...client];
  newUser.push({
    id:1,
    nome,
    cpf,
    dataNasc,
    saldo:0,
    extratos:[{ valor: 0, data: "", descricao: "" }]   
    
  });
  return newUser;
};
export const addMovementAccount = (client:types.Conta[], data:string, descricao:string,valor:number,cpf:string):types.Conta[]=>{
  const newAccount  = [...client];
  if(!data){
    data = formatDate();
  }
  const account = newAccount.filter((user)=>{
    if (user.cpf === cpf){
      user.extratos.push({valor,data,descricao});
    }
  })
  return newAccount
}

export const validityAge = (birthdate:string):number=>{
    const date = new Date
    const currentYear = date.getFullYear();
    const largerAge = currentYear - Number(birthdate.substring(0,4))
    return largerAge    
}

export const validiBalance = (client:types.Conta[],cpf:string, valor:number):boolean=>{
  let balance
  const compareBalance = client.filter((user)=>{
    if (user.cpf === cpf){return user}
  }).map((user)=>{return user.saldo})
    return compareBalance[0]<valor ? true: false
  }

export const formatDate = ():string=>{
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDate = date.getDate();
  return (currentYear+"-"+currentMonth+"-"+currentDate)
} 

export const validiDate = (dateAccount:any):boolean=>{
  let parts = dateAccount.split('-')
  let today = new Date()
  dateAccount = new Date(parts[0], parts[1] - 1, parts[2])
  return dateAccount >= today ? true : false
}
 

