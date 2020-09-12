import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {tipos} from '../AST/Tipo';

class Imprimir extends Nodo{
  
    expresion: Nodo;
 
    constructor(expresion: Nodo, linea: number, columna: number){
        super(new Tipo(tipos.VOID), linea, columna);
        this.expresion = expresion;
    }
    get_tipo(){
        return this.tipo;
    }
    
    ejecutar(tabla: Tabla, arbol: Arbol): any {
        const value =  this.expresion.ejecutar(tabla, arbol);
        arbol.consola.push(value);
        return null;
    }
}
export{Imprimir};