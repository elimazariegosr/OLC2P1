import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Tipo } from '../AST/Tipo';

class Return extends Nodo {

    condicion: Nodo;
    valor: Object;
    constructor(condicion: Nodo, linea: number, columna: number) {
        super(condicion.tipo, linea, columna);
        this.condicion = condicion;
        this.valor = null;
    }

    get_tipo(){
        return this.tipo;
    }
    ejecutar(tabla: Tabla, arbol: Arbol){
        if(this.condicion != null){
            this.valor = this.condicion.ejecutar(tabla, arbol);
            this.tipo = this.condicion.tipo;
            return this;
        }
        return null;
    }
}
export {Return};