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
  totalHoras: number;
  totalGeneral: number;
  proyecto: Proyecto;
  aportesPlanilla?: AportePlanilla[];
  detalles?: DetallePlanilla[];
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
  totalHoras?: number;
  totalGeneral?: number;
}

export interface DetallePlanilla {
  idDetallePlanilla: number;
  idPlanilla: number;
  idTrabajadorProyecto: number;
  totalDescuentos: number;
  diasTrabajados: number;
  horasTrabajadas: number;
  totalMonto: number;
  totalHoras: number;
  fechaCreacion: string;
  usuarioCreacion: string;
}

export interface AportePlanilla {
  idAportePlanilla: number;
  idPlanilla: number;
  tipoAporte: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago: string;
  estado: number;
}
