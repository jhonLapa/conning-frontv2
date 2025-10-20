export interface ResumenMensual {
  mes: string;
  total: number;
}

export interface Movimiento {
  fecha: string;
  tipo: string;
  descripcion: string;
  monto: number;
}

export interface Dashboard {
  totalVentas: number;
  totalCompras: number;
  totalPlanillas: number;
  totalMovimientos: number;
  totalProyectosActivos: number;
  totalIngresos: number;
  totalEgresos: number;
  ventasMensuales: ResumenMensual[];
  comprasMensuales: ResumenMensual[];
  planillasMensuales: ResumenMensual[];
  ultimosMovimientos: Movimiento[];
}
