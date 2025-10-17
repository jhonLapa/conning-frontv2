export interface Regimen {
  idRegimen: number;
  nombre: string;
  tipo: string;
  estado: number;
  comision: number | null; 
  prima: number | null; 
  aporte: number;
  total: number;   
  tope: number | null;
}
export interface RegimenRequest {
  nombre: string;
  tipo: string;
}
