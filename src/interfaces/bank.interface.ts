export interface Bank {
    id: number
    nombre:string
    nombreCorto:string
    swiftCode:string
    codigoPais:string
    estado: number
    fechaCreacion:string
}

export interface BankRequest {
    nombre:string
    nombreCorto:string
    swiftCode:string
    codigoPais:string
}