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

export const validityAge = (birthdate:string)=>{
    const date = new Date
    const currentYear = date.getFullYear();
    const largerAge = currentYear - Number(birthdate.substring(6,10))
    return largerAge    
}

