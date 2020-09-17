import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';

class Type extends Nodo{

    nombre: String;
    id: string;
    attributos: Map<string, Object>;

    constructor(nombre: String, atributos: Map<string, Tipo>, linea: number, columna: number){
        super(new Tipo(tipos.TYPE), linea, columna);
        this.nombre = nombre;
        this.id = "type#_" + nombre;
        this.attributos = atributos;   
    }

    get_tipo(){

    }

    ejecutar(tabla: Tabla, arbol: Arbol){

    }
}