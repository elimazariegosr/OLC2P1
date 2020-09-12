import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {Errror} from '../AST/Errror';
import { Simbolo } from '../AST/Simbolo';
import {tipos} from '../AST/Tipo';

class Asignacion extends Nodo{
    id: string;
    valor: Nodo;
    
    constructor(id: string, valor:Nodo, linea: number, columna: number){
        super(null, linea, columna);
        this.id = id;
        this.valor = valor;
    }

    get_tipo(){return this.tipo};
    ejecutar(tabla: Tabla, arbol:Arbol){
        const res = this.valor.ejecutar(tabla,arbol);
        if(res instanceof Errror){
            return res;
        }
        let variable: Simbolo;
        variable = tabla.get_var(this.id);
        if (variable == null) {
            const error = new Errror('Semantico',
                'No esta declarada la variable ' + this.id,
                this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
        }

        if (this.valor.tipo.type != variable.tipo.type && variable.tipo.type != tipos.ANY) {
            const error = new Errror('Semantico',
                `No se puede asignar la variable porque los tipos no coinciden.`,
                this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
        }

        variable.valor = res;
        return null;
    }
}
export{Asignacion};