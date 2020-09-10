import {Tipo} from './Tipo';

class Simbolo{
    tipo: Tipo;
    id: string;
   /* ambito: string;
    funcion: string;*/
    valor: Object;
  
    constructor(tipo: Tipo, id: string, valor: Object/*, ambito: string, funcion: string*/) {
        this.tipo = tipo;
        this.id = id;
        this.valor = valor;/*
        this.ambito = ambito;
        this.funcion = funcion;*/
    }
}

export {Simbolo};