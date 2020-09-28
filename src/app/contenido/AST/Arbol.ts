import {Nodo} from './Nodo';
import {Errror} from './Errror';
import {Tabla} from './Tabla';
import { error } from 'protractor';
class Arbol{

    instrucciones: Array<Nodo>;// Lista de instrucciones globales
    errores: Array<Errror>;// lissta de errores lexIcos, sintacticos ysemanticos
    consola: Array<String>;// consola de resultado
    reportes: Array<string>;// reporte de ts (guarda una lsita de tablas en html)
  
    constructor(instrucciones: Array<Nodo>, errores: Array<Errror>) {// inizializacion de attributos
        this.instrucciones = instrucciones;
        this.errores = errores;
        this.consola = new Array<String>();
        this.reportes = new Array<string>();
    }    
}

export {Arbol}; 