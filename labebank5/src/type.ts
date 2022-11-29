export type Conta={
    id: number,
    nome: string,
    cpf: string,
    dataNasc: string,
    saldo: number,
    extratos: Extrato[]
}

export type Extrato={
    valor:number,
    data:string,
    descricao:string
}