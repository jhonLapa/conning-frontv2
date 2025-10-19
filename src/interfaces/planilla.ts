import { Proyecto } from "./proyecto.interface";

export interface Planilla {
  idPlanilla: number;
  idProyecto: number;
  mes: number;
  anio: number;
  periodoInicio: string;
  periodoFin: string;
  fechaPago: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
  frecuenciaPago: string | null;
  periodoTexto: string;
  proyecto: Proyecto;
}

export interface PlanillaRequest {
  idProyecto: number;
  mes: number;
  anio: number;
  periodoInicio: string;
  periodoFin: string;
  fechaPago: string;
  frecuenciaPago: string;
  periodoTexto: string;
}
