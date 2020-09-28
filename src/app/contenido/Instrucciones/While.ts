import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol} from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { tipos } from '../AST/Tipo';
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { Return } from '../Expresiones/Return';

class While extends Nodo{

    condicion: Nodo;
    contenido: Array<Nodo>;

    constructor(condicion: Nodo, contenido: Array<Nodo>, linea: number, columna: number) {
        super(null, linea, columna);
        this.condicion = condicion;
        this.contenido = contenido;
    }
    get_tipo(){
        
    }

    v():number{return 0;}

    ejecutar(tabla:Tabla, arbol: Arbol){
        let nueva_tabla = new Tabla(tabla);
        let res: Nodo;
        let contador = 0;
        do {
            
            res = this.condicion.ejecutar(nueva_tabla, arbol);
            if (res instanceof Errror) {
                return res;
            }

            if (this.condicion.tipo.type != tipos.BOOLEAN) {
                const error = new Errror('Semantico',
                    `Se esperaba una expresion booleana para la condicion`,
                    this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;        
              }
            if (res) {
                for (let i = 0; i < this.contenido.length; i++) {
                    const cont = this.contenido[i].ejecutar(nueva_tabla, arbol);
                    if(cont instanceof Return){
                        return cont;
                    }
                    if(cont instanceof Continue || cont instanceof Break){
                        return null;
                    }
                }
            }else{
                return null;
            }
            contador++;
            nueva_tabla = new Tabla(tabla);
        } while (res && contador < 999999);
        return null;
    
    }
}
export {While};