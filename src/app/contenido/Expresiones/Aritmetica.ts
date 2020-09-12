import {Arbol} from '../AST/Arbol';
import {Errror} from '../AST/Errror';
import {Tipo, tipos} from  '../AST/Tipo';
import {Nodo} from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';

class Aritmetica extends Nodo{
    
    nodo_izquierdo: Nodo;
    nodo_derecho: Nodo;
    operador: string;

    constructor(nodo_izquierdo: Nodo, nodo_derecho: Nodo, operador:string, linea: number, columna: number){
        super(null,linea, columna);
        this.nodo_derecho = nodo_derecho;
        this.nodo_izquierdo = nodo_izquierdo;
        this.operador = operador;

    } 
    get_tipo(){
        return this.tipo;
    }
    ejecutar(tabla: Tabla, arbol:Arbol){
        if(this.nodo_derecho != null){
            const resultado_izq = this.nodo_izquierdo.ejecutar(tabla, arbol);
            if(resultado_izq instanceof Errror){
                return resultado_izq;
            }
            const resultado_der  = this.nodo_derecho.ejecutar(tabla, arbol);
            if(resultado_der instanceof Errror){
                return resultado_der;
            }
            
            if(this.operador == '+'){
                if(this.nodo_izquierdo.tipo.type == tipos.NUMBER && 
                    this.nodo_derecho.tipo.type == tipos.NUMBER){
                
                    this.tipo = new Tipo(tipos.NUMBER);
                    return resultado_izq + resultado_der;        
                }else if(this.nodo_izquierdo.tipo.type == tipos.STRING || 
                    this.nodo_derecho.tipo.type == tipos.STRING){

                        this.tipo = new Tipo(tipos.STRING);
                        return resultado_izq + resultado_der;        
                }else{
                    const error = new Errror("Semantico","Error al operar con +", this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.desc);
                    return error;
                }
            }else if(this.operador == '-'){
                if(this.nodo_izquierdo.tipo.type == tipos.NUMBER && 
                    this.nodo_derecho.tipo.type == tipos.NUMBER){
                
                    this.tipo = new Tipo(tipos.NUMBER);
                    return resultado_izq - resultado_der;        

                }else{
                    const error = new Errror("Semantico","Error al operar con - ", this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.desc);
                    return error;
                }
            }else if(this.operador == '*'){
                if(this.nodo_izquierdo.tipo.type == tipos.NUMBER && 
                    this.nodo_derecho.tipo.type == tipos.NUMBER){
                
                    this.tipo = new Tipo(tipos.NUMBER);
                    return resultado_izq * resultado_der;        

                }else{
                    const error = new Errror("Semantico","Error al operar con * ", this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.desc);
                    return error;
                }
            }else if(this.operador == '/'){
                if(this.nodo_izquierdo.tipo.type == tipos.NUMBER && 
                    this.nodo_derecho.tipo.type == tipos.NUMBER){
                    this.tipo = new Tipo(tipos.NUMBER);
                    if (resultado_der === 0) {
                        const error = new Errror("Semantico", "No se puede dividir entre 0", this.linea, this.columna);
                            arbol.errores.push(error);
                            arbol.consola.push(error.desc);
                            return error;
                        }
                    return resultado_izq / resultado_der;        

                }else{
                    const error = new Errror("Semantico","Error al operar con * ", this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.desc);
                    return error;
                }
            }
        }else{
            const resultado_izq = this.nodo_izquierdo.ejecutar(tabla, arbol);
            if (resultado_izq instanceof Errror) {
                return resultado_izq;
            }
            if (this.operador === '-') {
                if (this.nodo_izquierdo.tipo.type === tipos.NUMBER) {
                    this.tipo = new Tipo(tipos.NUMBER);
                    return -1 * resultado_izq;
                } else {
                    const error = new Errror('Semantico',"Error en operacion unaria, valor no es numeric",this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.desc);
                    return error;
                }
            } else {
                const error = new Errror('Semantico',"Error operador desconocido",this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.desc);
                return error;
            }
        }
    }
}
export {Aritmetica};