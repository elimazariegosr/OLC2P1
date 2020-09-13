
import {Arbol} from '../AST/Arbol';
import { Aritmetica } from '../Expresiones/Aritmetica';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Primitivo } from '../Expresiones/Primitivo';
import { Return } from '../Expresiones/Return';
import { Asignacion } from '../Instrucciones/Asignacion';
import { Declaracion } from '../Instrucciones/Declaracion';
import { Funcion } from '../Instrucciones/Funcion';
import { If } from '../Instrucciones/If';
import { While } from '../Instrucciones/While';
class Desanidar{

    contenido:Array<Object> = [];
    contador = 0;
    desanidar(arbol: Arbol):string{
        this.contenido = [];
        for(let i  = 0; i < arbol.instrucciones.length; i++){
            let instruccion = arbol.instrucciones[i];
            if(instruccion instanceof Funcion){
                this.recorrer_funcion(instruccion, instruccion.nombre);
            }else{
                this.contenido.push(instruccion);
            }
        }
        return this.traducir();
    }
    traducir():string{
        let traduccion = "";
        for(let i = this.contenido.length - 1; i >= 0; i--){
            let val =  this.contenido[i];
            if(val instanceof Funcion){
                traduccion += "\n" + this.funcion(val,"");   
            }
        }
        return traduccion;
    }
    funcion(func:Funcion,tab):string{
        let valor = "";
        let params = this.calcular_par(func.parametros);
        valor += "function " + func.nombre 
                        + "("+ params  + "): " + func.tipo + " {";  
        func.contenido.forEach(element => {
           valor +="\n" + this.sentencias(element, tab);
        });
        valor += "}";
        return valor;
    }
    sentencias(sent:Object, tab): string{
        if(sent instanceof If){

        }else if(sent instanceof While){

        }else if(sent instanceof Declaracion){

        }else if(sent instanceof Asignacion){

        }else if(sent instanceof Break){

        }else if(sent instanceof Continue){

        }else if(sent instanceof Return){

        }else if(sent instanceof While){

        }
        return "";
    }
    sent_if(sent:If,tab){
        let cont = "";

    }
    sent_declaracion(tab){

    }

    calcular_par(params: Array<Declaracion>):string{
        let res = "";
        for(let i = 0; i < params.length; i++){
            if(i != 0){
                res += ", ";
            }
            res += params[i].id + ": " + params[i].tipo; 
   
        }
        return res;   
    }



    recorrer_funcion(func: Funcion, nombre: string){
        let f_aux = new Funcion(nombre, func.parametros,[],func.tipo,func.linea, func.columna);
        for(let i = 0; i < func.contenido.length; i++){
            let inst = func.contenido[i];
            if(inst instanceof Funcion){
                this.recorrer_funcion(inst, nombre + "_" + inst.nombre);
            }else{
                f_aux.contenido.push(inst);
            }
        }
        this.contenido.push(f_aux);
    }


    hay_anidada(arbol: Arbol):boolean{
        for(let i = 0; i < arbol.instrucciones.length; i++){
            let funcion  = arbol.instrucciones[i];
            if(funcion instanceof Funcion){
                for(let j = 0; j < funcion.contenido.length; j++){
                    let contenido = funcion.contenido[i];
                    if(contenido instanceof Funcion){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

export {Desanidar};