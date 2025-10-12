import { Cliente } from "./cliente.interface";

export interface Proyecto {
  idProyecto: number;
  idCliente: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  frecuenciaPago: string; 
  email: string;
  estado: number;
  fechaCreacion: string;
  cliente: Cliente;
}

export interface ProyectoRequest {
  nombre: string;
  idCliente: number;
  descripcion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  frecuenciaPago: string;
}
