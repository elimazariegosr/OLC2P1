import { Type } from '@angular/core';

import {Tipo} from './Tipo';
import {Tabla} from './Tabla';
import {Arbol} from './Arbol';

abstract class Nodo{
    linea : number;
    columna : number;
    tipo : Tipo;

    abstract ejecutar(tabla: Tabla, arbol: Arbol): any;

    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
    }
   
}

export{Nodo};