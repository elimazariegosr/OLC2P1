import {Nodo} from './Nodo';
import {Errror} from './Errror';
import {Tabla} from './Tabla';
class Arbol{
    instrucciones: Array<Nodo>;
    errores: Array<Errror>;
    consola: Array<String>;
    reportes: Array<string>;
    constructor(instrucciones: Array<Nodo>) {
        this.instrucciones = instrucciones;
        this.errores = new Array<Errror>();
        this.consola = new Array<String>();
        this.reportes = new Array<string>();
    }    
}

export {Arbol}; 