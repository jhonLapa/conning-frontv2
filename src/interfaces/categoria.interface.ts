import { ConceptoCategoria } from "./concepto-categoria.interface";

export interface Categoria {
  idCategoria: number;
  nombre: string;
  estado: number;
  fechaCreacion: string;
  conceptosCategoria?: ConceptoCategoria[];
}

export interface CategoriaRequest {
  nombre: string;
}
