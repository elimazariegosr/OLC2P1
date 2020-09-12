import {Nodo} from '../AST/Nodo';
import {Tipo} from '../AST/Tipo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';

class Primitivo extends Nodo{
    
    valor: Object;

    constructor(tipo:Tipo, valor: Object, linea: number, columna: number){
        super(tipo, linea, columna);
        this.valor = valor;
    }

    get_tipo(){
        return this.tipo;
    }
    
    ejecutar(tabla: Tabla, arbol: Arbol) {
        return this.valor;
    }
}
export {Primitivo};
