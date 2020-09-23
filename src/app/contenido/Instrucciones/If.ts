import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol} from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { tipos } from '../AST/Tipo';
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { Return } from '../Expresiones/Return';

class If extends Nodo {
    condicion: Nodo;
    lista_if: Array<Nodo>;
    lista_else: Array<Nodo>;
  
    constructor(condicion: Nodo, lista_if: Array<Nodo>, lista_else: Array<Nodo>, linea: number, columna: number) {
        super(null, linea, columna);
        this.condicion = condicion;
        this.lista_if = lista_if;
        this.lista_else = lista_else;
    }

    get_tipo(){
        return this.tipo;
    }
    ejecutar(tabla: Tabla, arbol: Arbol) {
        const nueva_tabla = new Tabla(tabla);
        let res: Nodo;
        res = this.condicion.ejecutar(nueva_tabla, arbol);
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

        if (res) {

            for (let i = 0; i < this.lista_if.length; i++) {
                if(this.lista_if[i] instanceof Return){
                    return this.lista_if[i];
                }
                
                const cont = this.lista_if[i].ejecutar(nueva_tabla, arbol);
                if(cont instanceof Return){
                    return cont;
                }
                if(cont instanceof Continue || cont instanceof Break){
                    return cont;
                }
            }
        } else {  
            for (let i = 0; i < this.lista_else.length; i++) {
                if(this.lista_else[i] instanceof Return){
                    return this.lista_else[i];
                }
                const cont = this.lista_else[i].ejecutar(nueva_tabla, arbol);
                if(cont instanceof Return){
                    return cont;
                }
                
                
                if(cont instanceof Continue || cont instanceof Break){
                    return cont;
                }
            }
        }
        return null;
    }
}
export{If};
