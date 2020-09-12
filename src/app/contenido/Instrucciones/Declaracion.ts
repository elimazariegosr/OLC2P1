import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {Errror} from '../AST/Errror';
import { Simbolo } from '../AST/Simbolo';
import {tipos} from '../AST/Tipo';
class Declaracion extends Nodo{

    tipo_declaracion: string;
    tipo: Tipo;
    id: string;
    valor: Nodo;

    constructor(tipo: Tipo, id: string, valor: Nodo, linea: number, columna: number) {
        if(tipo == null){
            tipo = new Tipo(tipos.ANY);
        }
        super(tipo, linea, columna);
        this.id = id;
        this.valor = valor;
        
    }

    get_tipo(){return this.tipo};
    ejecutar(tabla: Tabla, arbol: Arbol){
        let resultado = null;
        if(this.valor != null){
            resultado = this.valor.ejecutar(tabla, arbol);
            if (resultado instanceof Errror) {
                return resultado;
            }    
            if(this.tipo.type != this.valor.tipo.type && this.tipo.type != tipos.ANY){
                const error = new Errror('Semantico',
                `No se puede declarar la variable porque los tipos no coincidennnn.`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
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
        return null;
    }
}
export {Declaracion};