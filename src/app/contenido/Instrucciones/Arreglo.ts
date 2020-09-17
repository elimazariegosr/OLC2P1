import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';

class Arreglo extends Nodo{

    nombre: string;
    contenido: Array<Nodo>;

    get_tipo(){

    }
    ejecutar(tabla: Tabla, arbol: Arbol){

    }

    arreglo_push(){

    }
}