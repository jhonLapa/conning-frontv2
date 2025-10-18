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

export interface AporteSindicato {
  idAporteSindicato: number;
  idProyecto: number;
  mes: string;
  anio: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: string;
  observacion?: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  trabajadoresIds?: number[];
}

export interface AporteSindicatoRequest {
  idProyecto: number;
  mes: string;
  anio: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: string;
  observacion?: string;
  trabajadores: number[];
}