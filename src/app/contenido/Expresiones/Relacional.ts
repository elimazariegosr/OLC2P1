import { Nodo } from "../AST/Nodo";
import { Tabla } from "../AST/Tabla";
import { Arbol } from "../AST/Arbol";
import { Errror } from "../AST/Errror";
import { tipos, Tipo } from "../AST/Tipo";
import { type } from 'os';

class Relacional extends Nodo{
    nodo_izquierdo: Nodo;
    nodo_derecho: Nodo;
    operador: string;

    constructor(nodo_izquierdo: Nodo, nodo_derecho: Nodo, operador: string, linea: number, columna: number) {
        super(new Tipo(tipos.BOOLEAN), linea, columna);
        this.nodo_izquierdo = nodo_izquierdo;
        this.nodo_derecho = nodo_derecho;
        this.operador = operador;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        const resultado_izq = this.nodo_izquierdo.ejecutar(tabla, arbol);
        if(resultado_izq instanceof Errror){
            return resultado_izq;
        }
        const resultado_der = this.nodo_derecho.ejecutar(tabla,arbol);
        if(resultado_der instanceof Errror){
            return resultado_der;
        }
        if(this.operador == '>'){
            if(this.nodo_derecho.tipo.type == tipos.NUMBER && this.nodo_derecho.tipo.type == tipos.NUMBER){
                return resultado_izq > resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con <`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
    
            }
        }else if(this.operador == '<'){
            if(this.nodo_derecho.tipo.type == tipos.NUMBER && this.nodo_derecho.tipo.type == tipos.NUMBER){
                return resultado_izq < resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con <`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
        }else if(this.operador == '>='){
            if(this.nodo_derecho.tipo.type == tipos.NUMBER && this.nodo_derecho.tipo.type == tipos.NUMBER){
                return resultado_izq >= resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con >=`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
        }else if(this.operador == '<='){
            if(this.nodo_derecho.tipo.type == tipos.NUMBER && this.nodo_derecho.tipo.type == tipos.NUMBER){
                return resultado_izq <= resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con <=`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
        }else if(this.operador == '=='){
            if(this.nodo_derecho.tipo.type ==  this.nodo_derecho.tipo.type){
                return resultado_izq == resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con ==`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
        }else if(this.operador == '!='){
            if(this.nodo_derecho.tipo.type ==  this.nodo_derecho.tipo.type){
                return resultado_izq != resultado_der;
            }else{ 
                const error = new Errror('Semantico',
                `Error al relacionar los tipos con !=`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
        }
    }
}
export {Relacional};