import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';

class Typo extends Nodo{

    nombre: String;
    id: string;    
    attributos: Map<string, Tipo>;
    
    constructor(nombre: String, atributos: Map<string, Tipo>, linea: number, columna: number){
        super(new Tipo(tipos.TYPE), linea, columna);
        this.nombre = nombre;
        this.id = "TYPEREF#_" + nombre;
        this.attributos = atributos;   
    }


    ejecutar(tabla: Tabla, arbol: Arbol){
        let simbolo: Simbolo;    
        simbolo = new Simbolo(this.tipo, this.id, this, this.linea, this.columna);
        const resp = tabla.set_variable(simbolo);
        if(resp != null){
            const error = new Errror('Semantico: Declaracion de Type',resp, this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;           
        }
        return null;
    }   
}
export{Typo};
