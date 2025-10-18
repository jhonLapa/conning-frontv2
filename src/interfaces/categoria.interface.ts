export interface Categoria {
  idCategoria: number;
  nombre: string;
  estado: number;
  fechaCreacion: string;

  conceptosCategoria: ConceptosCategoria[];
  conceptosCategoriaRequest: ConceptosCategoriaRequest[];
}

export interface CategoriaRequest {
  nombre: string;
}


export interface ConceptosCategoria {
  idConcepto: number;
  idCategoria: number;
  nombreConcepto: string;
  valor: number;
  estado: number;
  fechaCreacion: string;          // o Date si luego la manejas como objeto de fecha
  usuarioCreacion: string;
  fechaCambioEstado: string | null;  // null si aún no hay fecha
  usuarioCambioEstado: string | null;
}

export interface ConceptosCategoriaRequest {
  idCategoria: number;
  nombreConcepto: string;
  estado: number;
}
