import { Type } from '@angular/core';

import {Tipo} from './Tipo';
import {Tabla} from './Tabla';
import {Arbol} from './Arbol';

abstract class Nodo{
    linea : number;
    columna : number;
    tipo : Tipo;

    abstract ejecutar(tabla: Tabla, arbol: Arbol): any;

    graficar_ts(tabla: Tabla){
        let t_actual: Tabla;
        let ambito = "";
        
        for(t_actual = tabla; t_actual != null; t_actual = t_actual.t_anterior){
            for(let key of Array.from( t_actual.variables.keys()) ) {
               if(t_actual.t_anterior ==  null){
                    ambito = "Global";
                }else{
                    ambito = "Local";
                }
                t_actual.variables.get(key).ambito = ambito;
                console.log(t_actual.variables.get(key));
            }
        }
         //recorrrer la tabla   
    }
    abstract get_tipo():any;
    
    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
    }
   
}

export{Nodo};