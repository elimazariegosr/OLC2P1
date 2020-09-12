import { Nodo } from "../AST/Nodo";
import { Tabla } from "../AST/Tabla";
import { Arbol } from "../AST/Arbol";
import { Errror } from "../AST/Errror";
import { tipos, Tipo } from "../AST/Tipo";

class Logica extends Nodo{
    
    nodo_izquierdo: Nodo;
    nodo_derecho: Nodo;
    operador: string;

    constructor(nodo_izquierdo: Nodo, nodo_derecho: Nodo, operador: string, linea: number, columna: number){
        super(new Tipo(tipos.BOOLEAN), linea, columna);
        this.nodo_izquierdo = nodo_izquierdo;
        this.nodo_derecho = nodo_derecho;
        this.operador = operador;
    }
    get_tipo(){
        return this.tipo;
    }
    ejecutar(tabla: Tabla, arbol: Arbol){
        if(this.nodo_derecho != null){
            const resultado_izq  =  this.nodo_izquierdo.ejecutar(tabla,arbol);
            if(resultado_izq instanceof Errror){
                return resultado_izq;
            }
            const resultado_der = this.nodo_derecho.ejecutar(tabla, arbol);
            if(resultado_der instanceof Errror){
                return  resultado_der;
            }

            if(this.operador == '&&'){
                if (this.nodo_izquierdo.tipo.type == tipos.BOOLEAN &&
                        this.nodo_derecho.tipo.type == tipos.BOOLEAN) {
                    return resultado_izq && resultado_der;
                } else {
                    const error = new Errror('Semantico',"AND",this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;        
                }
            }else if(this.operador == '||'){
                if (this.nodo_izquierdo.tipo.type == tipos.BOOLEAN &&
                        this.nodo_derecho.tipo.type == tipos.BOOLEAN) {
                    return resultado_izq || resultado_der;
                } else {
                    const error = new Errror('Semantico',"OR",this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;        
                }
            } else {
                const error = new Errror('Semantico',"OR",this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;       
            }
        }else{
            const resultado_izq  =  this.nodo_izquierdo.ejecutar(tabla,arbol);
            if(resultado_izq instanceof Errror){
                return resultado_izq;
            }
            if (this.operador == '!') {
                if (this.nodo_izquierdo.tipo.type == tipos.BOOLEAN) {
                    return !resultado_izq;
                } else {
                    const error = new Errror('Semantico',"Negacion",this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;       
                }
            }else {
                const error = new Errror('Semantico',"Desconcido",this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;       
            }                      
        }      
    }
}
export{Logica};