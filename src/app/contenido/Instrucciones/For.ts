import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { tipos } from '../AST/Tipo';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Return } from '../Expresiones/Return';
import { Asignacion } from './Asignacion';
import { Declaracion } from './Declaracion';

class For extends Nodo{

    exp1:Object;
    exp2:Nodo;
    exp3:Asignacion;
    contenido: Array<Nodo>;

    constructor(exp1:Object, exp2:Nodo, exp3:Asignacion, contenido: Array<Nodo>,linea:number, columna:number){
        super(null, linea, columna);
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
        this.contenido = contenido;
    }

    get_tipo(){

    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        let nueva_tabla = new Tabla(tabla);
        let res;
        let contador = 0;
        if(this.exp1 instanceof Declaracion || this.exp1 instanceof Asignacion){
            this.exp1.ejecutar(tabla, arbol);
        }
        do {
            res = this.exp2.ejecutar(nueva_tabla, arbol);
            console.log(res);
            if (res instanceof Error) {
                return res;
            }

            if (this.exp2.tipo.type != tipos.BOOLEAN) {
                const error = new Errror('Semantico',
                    `Se esperaba una expresion booleana para la condicion`,
                    this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;        
              }
            
            if(res){
                for (let i = 0; i < this.contenido.length; i++) {                  
                    const cont = this.contenido[i].ejecutar(nueva_tabla, arbol);
                    if(cont instanceof Continue || cont instanceof Break || cont instanceof Return){
                        return cont;
                    }
                }   
            }else{
                return null;
            }
            contador++;
            nueva_tabla = new Tabla(tabla);
            this.exp3.ejecutar(nueva_tabla,arbol);
            } while (res && contador < 99999999);
 
    }
}
export{For};