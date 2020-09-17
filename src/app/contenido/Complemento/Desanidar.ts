
import {Arbol} from '../AST/Arbol';
import { Nodo } from '../AST/Nodo';
import { tipos } from '../AST/Tipo';
import { Aritmetica } from '../Expresiones/Aritmetica';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Logica } from '../Expresiones/Logica';
import { Primitivo } from '../Expresiones/Primitivo';
import { Relacional } from '../Expresiones/Relacional';
import { Return } from '../Expresiones/Return';
import { Asignacion } from '../Instrucciones/Asignacion';
import { Declaracion } from '../Instrucciones/Declaracion';
import { Do_while } from '../Instrucciones/Do_while';
import { For } from '../Instrucciones/For';
import { For_1 } from '../Instrucciones/For_1';
import { Funcion } from '../Instrucciones/Funcion';
import { Identificador } from '../Instrucciones/Identificador';
import { If } from '../Instrucciones/If';
import { Imprimir } from '../Instrucciones/Imprimir';
import { Llamada_funcion } from '../Instrucciones/Llamada_funcion';
import { While } from '../Instrucciones/While';
class Desanidar{

    contenido:Array<Object> = [];
    contador = 0;
    val_exp = "";
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

    recorrer_funcion(func: Funcion, nombre: string){
        let f_aux = new Funcion(nombre, func.parametros,[],func.tipo,func.linea, func.columna);
        for(let i = 0; i < func.contenido.length; i++){
            let inst = func.contenido[i];
            console.log(nombre);
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
                    let contenido = funcion.contenido[j];
                    if(contenido instanceof Funcion){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    traducir():string{
        let traduccion = "";
        for(let i = 0; i < this.contenido.length; i++){
            let val =  this.contenido[i];
            if(val instanceof Funcion){
                traduccion += this.funcion(val,"");   
            }else{
                traduccion += this.sentencias(val, "");
            }
            traduccion += "\n";
        }
        return traduccion;
    }

    funcion(func:Funcion,tab):string{
        let cont = "function "+ func.nombre + "("+ this.calcular_par(func.parametros)+ "):"+ func.tipo +"{";  
        func.contenido.forEach(element => {cont +="\n" + this.sentencias(element, "  ");}); 
        return cont + "\n}";;
    }
    sentencias(sent:Object, tab): string{
        let cont = "";
        if(sent instanceof If){
           cont = this.sent_if(sent, tab);
        }else if(sent instanceof Declaracion){
            cont = this.sent_declaracion(sent, tab);
        }else if(sent instanceof Asignacion){
            cont = this.sent_asignacion(sent, tab) + ";";
        }else if(sent instanceof Break){
            cont = tab + "break;";
        }else if(sent instanceof Continue){
            cont = tab + "continue;";
        }else if(sent instanceof Return){
            cont = this.sent_return(sent, tab);
        }else if(sent instanceof While){
            cont = this.sent_while(sent, tab);
        }else if(sent instanceof Do_while){
            cont = this.sent_do_while(sent, tab);
        }else if(sent instanceof For){
            cont = this.sent_for(sent, tab);
        }else if(sent instanceof For_1){
            cont = this.sent_for_inof(sent, tab);
        }else if(sent instanceof Imprimir){
            cont = this.sent_imprimir(sent, tab);
        }else if(sent instanceof Llamada_funcion){
            cont  = this.sent_llamada_funcion(sent,tab);
        }
        return cont;
    }

    sent_return(sent:Return, tab):string{
        let cont = tab + "return ";
        if(sent.condicion != null){cont += this.expresion(sent.condicion);}
        return cont + ";";
    }

    sent_llamada_funcion(sent:Llamada_funcion, tab):string{     
        return tab + this.llamada_funcion(sent) + ";";
    }

    llamada_funcion(sent:Llamada_funcion):string{
        let cont = sent.nombre + "(";
        for(let i = 0; i < sent.parametros.length; i++){
            if(i != 0){
                cont +=  ", " ;
            }
            cont += this.expresion(sent.parametros[i]);
        }          
        return cont + ")";
    }
    sent_for(sent: For, tab):string{
        let cont = tab + "for(";
        if(sent.exp1 instanceof Declaracion){
            cont += this.sent_declaracion(sent.exp1,"");
        }else if(sent.exp1 instanceof Asignacion){
            cont += this.sent_asignacion(sent.exp1,"");
        }
        cont += " "+ this.expresion(sent.exp2) + "; " + this.sent_asignacion(sent.exp3, "") + "){";
        sent.contenido.forEach(element => {
            this.sentencias(element, tab + "  ")
        });       
        return cont + "\n" + tab + "}";
 
    }

    sent_if(sent:If,tab):string{
        let cont = tab + "if (" + this.expresion(sent.condicion) + "){";
        sent.lista_if.forEach(element => {
            cont += "\n" +this.sentencias(element, tab + "  ");
        });
        if(sent.lista_else.length > 0){
            cont += "\n" + tab+ "}else{"; 
            sent.lista_else.forEach(element => {
                cont += "\n" +this.sentencias(element, tab + "  ");
            });        
        }
        return cont + "\n" + tab+ "}";
    }

    sent_declaracion(sent: Declaracion,tab): string{
        let cont = tab + sent.tipo_declaracion + " " + sent.id + " " ;
        if(sent.tipo != null){ cont += ":" + sent.tipo; }
        if(sent.valor != null){cont += "= "+ this.expresion(sent.valor);}
        return cont + ";";;
    }

    sent_asignacion(sent: Asignacion, tab){
        return tab + sent.id + " = " + this.expresion(sent.valor);
    }
    sent_imprimir(sent: Imprimir,tab){
        let cont = tab +"console.log(";
        if(sent.expresion != null){cont += this.expresion(sent.expresion);}       
        return cont + ");";
    }

    sent_for_inof(sent: For_1, tab){
        let cont  = "for( let " + sent.variable + " " +sent.tipo_for + " " + sent.id + "){";
        sent.contenido.forEach(element => {
            cont += "\n" + this.sentencias(element, tab + "  ");
        });
        return cont + "\n" + tab + "}";
    }
    sent_while(sent: While,tab){
        let cont = tab + "while(" + this.expresion(sent.condicion) + "){";
        sent.contenido.forEach(element => {cont +="\n" + this.sentencias(element, tab + "  ");});
        return cont + "\n" + tab + "}";
    }
    sent_do_while(sent: Do_while, tab){
        let cont = tab + "do{";
        sent.contenido.forEach(element => {cont +="\n" + this.sentencias(element, tab + "  ");});
        return cont  + "\n" + tab + "}while(" + this.expresion(sent.condicion) + ");"; 
        
    }
    
    expresion(exp:Object){
        let val = "";
        if(exp instanceof Logica || exp instanceof Relacional || exp instanceof Aritmetica){
            if(exp.nodo_izquierdo != null){
                val += this.expresion(exp.nodo_izquierdo);
            }
                val += " " +exp.operador + " ";
            if(exp.nodo_derecho != null){
                val += this.expresion(exp.nodo_derecho);;
            }        
        }else if(exp instanceof Primitivo){
            let temp;
            if(exp.tipo.type == tipos.STRING){
                temp  =  "\"" + exp.valor + "\"";
            }else{
                temp = exp.valor;
            }  
            return temp;          
        }else if(exp instanceof Identificador){return exp.id;
        }else if(exp instanceof Llamada_funcion){return this.llamada_funcion(exp);
        }       
        return val;
    }
   
    calcular_par(params: Array<Declaracion>):string{
        let res = "";
        for(let i = 0; i < params.length; i++){
            if(i != 0){ res += ", "; }
            res += params[i].id + ": " + params[i].tipo; 
        }
        return res;   
    }    
}

export {Desanidar};