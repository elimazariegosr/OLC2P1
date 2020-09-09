import {Nodo} from './Nodo';
import {Errror} from './Errror';

class Arbol{
    instrucciones: Array<Nodo>;
    errores: Array<Errror>;
    consola: Array<String>;

    constructor(instrucciones: Array<Nodo>) {
        this.instrucciones = instrucciones;
        this.errores = new Array<Errror>();
        this.consola = new Array<String>();
    }    
}

export {Arbol}; 