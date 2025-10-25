import { TipoDocumento } from "./tipo-documento.interface";
import { Categoria } from "./categoria.interface";
import { Regimen } from "./regimen.interface";
import { Bank } from "./bank.interface";

export interface CuentaBancariaRequest {
  idCuentaBanco?: number;
  idBanco: number;
  numeroCuenta: string;
  cci?: string | null; // ✅ acepta null
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
  sexo: string | null; // ✅ opcional pero controlado
  estadoCivil: string | null;
  asignacionFamiliar: number | null;
  hijos: number | null;
  fechaNacimiento?: string | null;
  fechaIngreso: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
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
  fechaNacimiento?: string | null;
  fechaIngreso: string;
  sexo: string;
  estadoCivil: string;
  asignacionFamiliar: number;
  hijos: number;
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
