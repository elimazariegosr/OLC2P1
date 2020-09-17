import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';

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

    get_tipo(){

    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        let res: Nodo;
        console.log("Cond");
        console.log(this.condicion);
        res = this.condicion.ejecutar(tabla, arbol);
        console.log(res);
        if (res instanceof Errror) {
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
            return this.exp1.ejecutar(tabla, arbol);
        }else{
            return this.exp2.ejecutar(tabla,arbol);
        }
    }
    
}
export{Ternario};