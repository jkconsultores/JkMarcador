import { Empresa } from "./empresa.interface";

export interface Local {
    id:     number;
    descripcion: string;
    ruc:         string;
    empresa:     Empresa;
}
