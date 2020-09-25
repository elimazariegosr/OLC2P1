import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Typo } from './Typo';


class Type_object extends Nodo{

    type: Typo;
    valores: Map<string, Nodo>;

    nombre_tipo: string;
    
    nombre: string;
    id: string;
    
    parametros: Object;

    constructor(nombre: string, nombre_tipo: string,parametros:Object, linea: number, columna: number){
        super(new Tipo(tipos.TYPE), linea, columna);
        this.nombre = nombre;
        this.nombre_tipo = nombre_tipo;
        this.parametros = parametros;
    }    

    buscar_padre(tabla: Tabla){
        let padre = tabla.get_var("TYPEREF#_" + this.nombre_tipo);
        
    }
    ejecutar(tabla: Tabla, arbol: Arbol){
        
    }
}