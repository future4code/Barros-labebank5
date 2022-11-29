const cpfInvalidos:Array<string>=[
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
]

function validarCpf(cpf: string):boolean {
  const numberCpf = cpf.replace(".","").replace(".","").replace("-","")
  let soma:number = 0
  let modulo:number
    const cpfValido = cpfInvalidos.some((item)=>{
       return item == numberCpf 
    })
  
if(cpfValido!=true){
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(numberCpf.substring(i-1,i))*(11-i) 
      }
      modulo = (soma*10)%11; 
      if((modulo===10)||(modulo===11)){
        modulo=0;
      }
      if (modulo!=parseInt(numberCpf.substring(9,10))){
        return false;
      }
      soma=0; 
       for (let i = 1; i <=10; i++) {
        soma += parseInt(numberCpf.substring(i-1,i))*(12-i)
      }
      modulo = (soma*10)%11
      if (modulo===10||modulo===11) {
        modulo=0
      }
      if (modulo!=parseInt(numberCpf.substring(10,11))){
        return false;
      } 
     
       return true
}else{
    return false    
}

}
export default validarCpf;