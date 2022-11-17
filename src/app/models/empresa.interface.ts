import { Local } from "./local.interface";

export interface Empresa {
    ruc:         string;
    descripcion: string;
    locales:     Local[];
    seleccionado: boolean;
}



