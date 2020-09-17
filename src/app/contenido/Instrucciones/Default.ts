import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Return } from '../Expresiones/Return';

class Default extends Nodo{

    contenido: Array<Nodo>;
    constructor(contenido: Array<Nodo>, linea: number, columna: number){
        super(null, linea, columna);
        this.contenido = contenido;
    }

    get_tipo(){

    }
    ejecutar(tabla: Tabla, arbol:Arbol){
        const nueva_tabla = new Tabla(tabla);
        for(let i = 0; i <  this.contenido.length; i++){
            if(this.contenido[i] instanceof Return){
                return this.contenido[i];
            }     
            const cont = this.contenido[i].ejecutar(nueva_tabla, arbol);
                if(cont instanceof Return){
                return cont;
            }
            if(cont instanceof Continue || cont instanceof Break){
                return cont;
            }
        }
    }
}
export{Default};