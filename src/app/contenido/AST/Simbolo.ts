import {Tipo} from './Tipo';

class Simbolo{
    tipo: Tipo;
    id: string;
    valor: Object;
  
    constructor(tipo: Tipo, id: string, valor: Object) {
        this.tipo = tipo;
        this.id = id;
        this.valor = valor;
    }
}

export {Simbolo};