export interface EmpleadoModel {
  id?:number;
  nombre: string;
  num_doc: string;
  tipo_doc: string;
  local: string;
  codigo: number;
  descripcion?:string;
  activo?:boolean;
}
