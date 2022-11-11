import { Conta } from "./type";

export let client:Conta[] = [
   { 
        id: 1,
        nome: "João",
        cpf: "000.000.000-00",
        dataNasc: "2001-08-05",
        saldo: 25000,
        extratos:[ 20, 500, 1000, 90 ],
    },
    { 
        id: 2,
        nome: "Maria",
        cpf: "111.111.111-11",
        dataNasc: "1980-04-12",
        saldo: 2000,
        extratos:[ 20, 5000, 90 ],
    },
    { 
        id: 3,
        nome: "Julio",
        cpf: "333.333.333-33",
        dataNasc: "1995-05-25",
        saldo: 4500,
        extratos:[ 20, 500, 50, 909 ],
    }

]