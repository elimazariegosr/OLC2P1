import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';

class Arreglo extends Nodo{

    nombre: string;
    contenido: Array<Nodo>;

    ejecutar(tabla: Tabla, arbol: Arbol){
        
    }

}