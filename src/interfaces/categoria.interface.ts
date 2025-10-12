export interface Categoria {
  idCategoria: number;
  nombre: string;
  estado: number;
  fechaCreacion: string;
}

export interface CategoriaRequest {
  nombre: string;
}
