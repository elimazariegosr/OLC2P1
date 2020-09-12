import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';

class Continue extends Nodo {
    constructor(linea: number, columna: number) {
        super(null, linea, columna);
    }
    ejecutar(tabla: Tabla, arbol: Arbol){
        return this;
    }
    get_tipo(){
        
    }
}
export {Continue};