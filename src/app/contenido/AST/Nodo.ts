import { Type } from '@angular/core';

import {Tipo} from './Tipo';
import {Tabla} from './Tabla';
import {Arbol} from './Arbol';

abstract class Nodo{
    linea : number;
    columna : number;
    tipo : Tipo;
    

    abstract ejecutar(tabla: Tabla, arbol: Arbol): any;

    graficar_ts(tabla: Tabla, arbol:Arbol){
        let t_actual: Tabla;
        let ambito = "";
        let graph = "<table class=\"table table-striped table-hover\">";
        graph += "<tr class=\"info\"><td>Nombre</td><td>Tipo</td><td>Ambito</td><td>Fila</td><td>Columna</td></tr>";
        for(t_actual = tabla; t_actual != null; t_actual = t_actual.t_anterior){
            for(let key of Array.from( t_actual.variables.keys()) ) {
               if(t_actual.t_anterior ==  null){
                    ambito = "Global";
                }else{
                    ambito = "Local";
                }
                let val = t_actual.variables.get(key);
                graph += "<tr><td>" + key + "</td><td>" 
                                + val.tipo + "</td><td>" 
                                + ambito + "</td><td>" 
                                + val.linea + "</td><td>" 
                                + val.columna + "</td></tr>" ;
            }
        }
        graph += "<table>";
         //recorrrer la tabla   
        arbol.reportes.push(graph);
    }
    
    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
    }
   
}

export{Nodo};