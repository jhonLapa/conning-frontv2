import { TipoDocumento } from "./tipo-documento.interface";
import { Categoria } from "./categoria.interface";
import { Regimen } from "./regimen.interface";
import { Bank } from "./bank.interface";

export interface CuentaBancariaRequest {
    idCuentaBanco?: number; 
    idBanco: number; 
    numeroCuenta: string;
    cci?: string;
    tipoCuenta: string; 
    moneda: string;  
    principal: number;  
    fechaInicio?: string; 
    fechaFin?: string; 
}
export interface TrabajadorRequest {
    idTrabajador?: number; 
    idTipoDocumento: number; 
    numeroDocumento: string;
    apellidosNombres: string;
    idCategoria: number; 
    idRegimen: number;   
    sexo:string;
    estadoCivil: string;
    asignacionFamiliar:string;
    hijos: number;
    fechaNacimiento?: string; 
    fechaIngreso: string; 
    email?: string;
    telefono?: string;
    direccion?: string;
    estado?: number; 
    cuentas: CuentaBancariaRequest[];
}

export interface CuentaBancaria {
    idCuentaBanco: number; 
    idTrabajador: number; 
    banco: Bank; 
    idBanco: number;   
    numeroCuenta: string;
    cci: string | null;
    tipoCuenta: string; 
    moneda: string;     
    principal: number;  
    fechaInicio: string;
    fechaFin: string | null;
    fechaCreacion: string;
}

export interface Trabajador {
    idTrabajador: number;
    numeroDocumento: string;
    apellidosNombres: string;
    fechaNacimiento: string;
    fechaIngreso: string;
    sexo: string;
    email: string;
    telefono: string;
    direccion: string;
    estado: number;
    fechaCreacion: string;
    tipoDocumento: TipoDocumento;
    categoria: Categoria;
    regimen: Regimen;
    cuentasBancarias: CuentaBancaria[]; 
}