export interface ConceptoCategoria {
  idConcepto: number;
  idCategoria: number;
  nombreConcepto: string;
  valor: number;
  tipoConcepto: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaCambioEstado: string | null;
  usuarioCambioEstado: string | null;
  categoria: {
    idCategoria: number;
    nombre: string;
    estado: number;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string | null;
    usuarioModificacion: string | null;
  };
}

export interface ConceptoCategoriaRequest {
  nombreConcepto: string;
  valor: number;
  idCategoria: number;
  tipoConcepto: string;
}
