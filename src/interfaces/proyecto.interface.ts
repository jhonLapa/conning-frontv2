import { Cliente } from "./cliente.interface";

export interface Proyecto {
  idProyecto?: number; // 👈 hazlo opcional
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
  trabajadores: TrabajadorProyectoCreate[];
  aportesSindicato: SindicatoDto[];
  proyectoEncargado: ProyectoEncargadoDto[];
}

export interface ProyectoInformePlanilla {
  idProyecto?: number; // 👈 hazlo opcional
  idCliente: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  frecuenciaPago: string;
  email: string;
  estado: number;
  totalPlanillas: number;
  fechaCreacion: string;
  cliente: Cliente;
  trabajadores: TrabajadorProyectoCreate[];
  aportesSindicato: SindicatoDto[];
  proyectoEncargado: ProyectoEncargadoDto[];
}

// 🧩 DTO principal — agrupa todo lo que enviarás al backend
export interface ProyectoFormData {
  proyecto: ProyectoCreate;
  trabajador: TrabajadorProyectoCreate[];
  sindicato: SindicatoDto[];
  proyectoEncargado?: ProyectoEncargadoDto | null; // ✅ opcional o null
}

// 🧱 Proyecto principal
export interface ProyectoCreate {
  idProyecto?: number; // 👈 hazlo opcional
  idCliente: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string; // se maneja como string para enviarlo al backend (formato "YYYY-MM-DD")
  fechaFin: string | null; // 👈 permitir null
  frecuenciaPago: string;
  usuarioCreacion: string;
}

// 👷 Relación de trabajadores con el proyecto
export interface TrabajadorProyectoCreate {
  idTrabajador: number;
  fechaInicio: string;
  fechaFin: string | null; // 👈 permitir null
  usuarioCreacion: string;
}

// 🏛️ Información de sindicato (aporte sindical)
export interface SindicatoDto {
  mes: string;
  monto: number;
  fechaPago: string;
  usuarioCreacion: string;
}

// 👤 Encargado del proyecto
export interface ProyectoEncargadoDto {
  idTrabajador: number;
  rol: string;
  fechaInicio: string;
  fechaFin: string | null; // 👈 permitir null
}
