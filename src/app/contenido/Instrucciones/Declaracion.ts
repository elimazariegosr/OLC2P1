import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {tipos} from '../AST/Tipo';
import {Errror} from '../AST/Errror';
import { Simbolo } from '../AST/Simbolo';

class Declaracion extends Nodo{

    tipo: Tipo;
    id: string;
    valor: Nodo;

    constructor(tipo: Tipo, id: string, valor: Nodo, linea: number, columna: number) {
        super(tipo, linea, columna);
        this.id = id;
        this.valor = valor;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        const resultado = this.valor.ejecutar(tabla, arbol);
        if (resultado instanceof Errror) {
            return resultado;
        }
        if(this.tipo.type != this.valor.tipo.type){
            const error = new Errror('Semantico',
            `No se puede declarar la variable porque los tipos no coinciden.`,
            this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
        }
        let simbolo: Simbolo;
        simbolo = new Simbolo(this.tipo, this.id, resultado);
        const resp = tabla.set_var(simbolo);
        if(resp != null){
            const error = new Errror('Semantico',resp, this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;           
        }
    }
}
export {Declaracion};