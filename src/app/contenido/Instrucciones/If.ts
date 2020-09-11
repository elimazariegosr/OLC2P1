import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol} from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { tipos } from '../AST/Tipo';
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";

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

    ejecutar(tabla: Tabla, arbol: Arbol) {
        const nueva_tabla = new Tabla(tabla);
        let res: Nodo;
        res = this.condicion.ejecutar(nueva_tabla, arbol);
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

        if (res) {
            console.log("en if");
            for (let i = 0; i < this.lista_if.length; i++) {
                const res = this.lista_if[i].ejecutar(nueva_tabla, arbol);
                if(res instanceof Continue || res instanceof Break){
                    return res;
                }
            }
        } else {
            
            console.log("en else");
            for (let i = 0; i < this.lista_else.length; i++) {
                const res = this.lista_else[i].ejecutar(nueva_tabla, arbol);
                if(res instanceof Continue || res instanceof Break){
                    return res;
                }
            }
        }
        return null;
    }
}
export{If};
