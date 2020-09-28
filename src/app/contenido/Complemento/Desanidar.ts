import {Arbol} from '../AST/Arbol';
import { Funcion } from '../Instrucciones/Funcion';
import { Traducir } from './Traducir';
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
        return new Traducir().traducir(this.contenido);
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
}

export {Desanidar};