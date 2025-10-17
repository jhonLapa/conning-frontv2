export interface CuentaBancariaTrabajador {
  idCuentaBanco: number;
  idTrabajador: number;
  idBanco: number;
  numeroCuenta: string;
  cci: string | null; // Asumiendo que el CCI es parte del modelo de BD
  tipoCuenta: string; 
  moneda: string;     
  principal: number; // 1 (true) o 0 (false)
  fechaInicio: Date | string;
  fechaFin: Date | string | null;
  fechaCreacion:string
  estado: number;

  // Propiedades de la relación (útiles para mostrar en la tabla)
  banco?: { 
    idBanco: number;
    nombre: string;
    // ... otras propiedades de Banco
  };
}

// 2. DTO de Solicitud (lo que el frontend envía para crear/editar)
export interface CuentaBancariaTrabajadorSaveRequest {
  idCuentaBanco?: number; // Opcional para crear
  idTrabajador: number;    // Necesario para asociar
  idBanco: number;
  numeroCuenta: string;
  cci: string | null; 
  tipoCuenta: string;
  moneda: string;
  principal: number;
  fechaInicio: Date | string;
  fechaFin: Date | string | null;
  estado: number;
}