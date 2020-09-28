import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Return } from '../Expresiones/Return';

class Ternario extends Nodo{

    condicion:Nodo;
    exp1:Nodo;
    exp2:Nodo;

    constructor(tipo:Tipo, condicion:Nodo, exp1:Nodo, exp2:Nodo, linea:number, columna:number){
        super(tipo, linea, columna);
        this.condicion = condicion;
        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        let res: Nodo;
        res = this.condicion.ejecutar(tabla, arbol);
        if (res instanceof Array) {
            return res;
        }

        if (this.condicion.tipo.type !== tipos.BOOLEAN) {
            const error = new Errror('Semantico',
                `condicion incorrecta`,
                this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
        }
        if(res){  
            const cont = this.exp1.ejecutar(tabla, arbol);
            this.tipo.type = this.exp1.tipo.type;
            if(cont instanceof Return){
                return cont;
            }
            if(cont instanceof Continue || cont instanceof Break){
                return null;
            }
            return cont;
        }else{  
            const cont = this.exp2.ejecutar(tabla, arbol);
            this.tipo.type = this.exp2.tipo.type;
            if(cont instanceof Return){
                return cont;
            }
            if(cont instanceof Continue || cont instanceof Break){
                return null;
            }
            return cont;
        }
    }
    
}
export{Ternario};