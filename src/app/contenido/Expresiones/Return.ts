import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Tipo } from '../AST/Tipo';

class Return extends Nodo {

    condicion: Nodo;
    constructor(condicion: Nodo, linea: number, columna: number) {
        super(condicion.tipo, linea, columna);
        this.condicion = condicion;
    }

    get_tipo(){
        return this.tipo;
    }
    ejecutar(tabla: Tabla, arbol: Arbol){
        if(this.condicion != null){
            return this.condicion;
        }
        return this;
    }
}
export {Return};