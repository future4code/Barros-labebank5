import { Conta } from "./type";

export let client:Conta[] = [
   { 
        id: 1,
        nome: "João",
        cpf: "000.000.000-00",
        dataNasc: "2001-08-05",
        saldo: 25000,
        extratos:[ 
            {valor: 200, data: "2022-08-14", descricao: "Compra1"}, 
            {valor: 500, data: "2022-11-01", descricao: "Compra2"}, 
            {valor: 300, data: "2022-11-05", descricao: "Compra3"}, 
        ],
    },
    { 
        id: 2,
        nome: "Maria",
        cpf: "111.111.111-11",
        dataNasc: "1980-04-12",
        saldo: 2000,
        extratos:[
            {valor: 2000, data: "2022-04-20", descricao: "Compra1"}, 
            {valor: 100, data: "2022-02-05", descricao: "Compra2"}, 
            {valor: 50, data: "2022-06-09", descricao: "Compra3"}, 
        ],
    },
    { 
        id: 3,
        nome: "Julio",
        cpf: "333.333.333-33",
        dataNasc: "1995-05-25",
        saldo: 4500,
        extratos:[ 
            {valor: 800, data: "2022-10-14", descricao: "Compra1"}, 
            {valor: 60, data: "2022-10-30", descricao: "Compra2"}, 
            {valor: 6000, data: "2022-11-08", descricao: "Compra3"}, 
         ],
    }

]