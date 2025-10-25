import { Proyecto } from "./proyecto.interface";

export interface Planilla {
  idPlanilla: number;
  idProyecto: number;
  mes: string;
  periodoInicio: string;
  periodoFin: string;
  fechaPago: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
  frecuenciaPago: string;
  periodoTexto: string;
  totalGeneral: number;
  proyecto: Proyecto;
  aportesPlanilla?: AportePlanilla[];
  detalles?: DetallePlanilla[];
}

// interfaces/planilla.ts
export interface PlanillaRequest {
  planilla: {
    idPlanilla: number;
    idProyecto: number;
    mes: string;
    periodoInicio: string;
    periodoFin: string;
    fechaPago: string;
    usuarioCreacion: string;
    frecuenciaPago: string;
    totalGeneral: number;
  };
  detalle: {
    idPlanilla: number;
    idTrabajadorProyecto: number;
    diasTrabajados: number;
    horasTrabajadas: number;
    totalMonto: number;
    totalHoras: number;
    totalDescuentos: number;
    usuarioCreacion: string;
    horas60: number;
    horas100: number;
    indemnizacion: number;
  }[];
  aportes: {
    idPlanilla: number;
    tipoAporte: string;
    monto: number;
    fechaVencimiento: string;
    fechaPago: string;
  }[];
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
  horas60: number;
  horas100: number;
  indemnizacion: number;
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
