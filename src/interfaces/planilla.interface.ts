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

// src/interfaces/planilla-informe.interface.ts
export interface PlanillaInforme {
  idPlanilla: number;
  idProyecto: number;
  mes: string;
  periodoInicio: string;
  periodoFin: string;
  fechaPago: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string;
  frecuenciaPago: string;
  periodoTexto: string;
  totalGeneral: number;

  proyecto: {
    idProyecto: number;
    idCliente: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string | null;
    estado: number;
    frecuenciaPago: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string;
    usuarioModificacion: string;
    trabajadores: {
      idTrabajadorProyecto: number;
      idTrabajador: number;
      idProyecto: number;
      fechaInicio: string;
      fechaFin: string | null;
      estado: number;
      fechaCreacion: string;
      usuarioCreacion: string;
      trabajador: {
        idTrabajador: number;
        idCategoria: number;
        idRegimen: number;
        tipoDocumentoId: number;
        numeroDocumento: string;
        apellidosNombres: string;
        fechaNacimiento: string;
        telefono: string | null;
        email: string | null;
        sexo: string | null;
        estadoCivil: string | null;
        estado: number;
        direccion: string | null;
        asignacionFamiliar: number;
        hijos: number;
        fechaCreacion: string;
        usuarioCreacion: string | null;
        fechaModificacion: string | null;
        usuarioModificacion: string | null;
      };
    }[];
  };

  detalles: {
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
  }[];
}

export interface ConceptoPlanilla {
  codigo: string;
  nombre: string;
  nombreMostrar: string;
  tipo: "INGRESO" | "DESCUENTO" | "APORTE";
  valor: number;
}

export interface BoletaDto {
  idPlanilla: number;
  proyecto: string;
  periodo: string;
  apellidosNombres: string;
  dni: string;
  categoria: string;
  regimen: string;
  diasTrabajados: number;
  horas60: number;
  horas100: number;
  indemnizacion: number;
  totalIngresos: number;
  totalDescuentos: number;
  totalAportes: number;
  netoPagar: number;
  conceptos: ConceptoPlanilla[];
}