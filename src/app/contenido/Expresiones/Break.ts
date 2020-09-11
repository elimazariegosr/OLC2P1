import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';

class Break extends Nodo {

    constructor(linea: number, columna: number) {
        super(null, linea, columna);
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        return this;
    }
}
export {Break};