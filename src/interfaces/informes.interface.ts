export interface TrabajadorProyectoItem {
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
    numeroDocumento: string;
    apellidosNombres: string;
    fechaNacimiento?: string | null;
    hijos?: number | null;
  };
}

export interface ProyectoInforme {
  idProyecto: number;
  nombre: string;
  trabajadores: TrabajadorProyectoItem[];
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

export interface PlanillaBusqueda {
  idPlanilla: number;
  idProyecto: number;
  totalGeneral: number;
  fechaPago: string;
  periodoTexto: string;
  mes?: string;
  frecuenciaPago?: string;
  proyecto: ProyectoInforme;
  detalles: DetallePlanilla[];
}

export interface Paginado<T> {
  data: T[];
  meta: {
    page: number;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface InformeRow {
  idPlanilla: number;
  idTrabajador: number;
  trabajador: string;
  idProyecto: number;
  proyecto: string;
  total: number;
  detalles: DetallePlanilla[];
}

export interface ProyectoResumen {
  idProyecto: number;
  nombre: string;
}
