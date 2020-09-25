import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Return } from '../Expresiones/Return';
import { Case } from './Case';
import { Default } from './Default';

class Switch extends Nodo{

    expresion: Nodo;
    contenido: Array<Nodo>;
    constructor(expresion: Nodo, contenido: Array<Nodo>,linea: number, columna: number){
        super(null, linea, columna);
        this.expresion = expresion;
        this.contenido = contenido;
    }

    get_tipo(){

    }
    ejecutar(tabla: Tabla, arbol:Arbol){
        const nueva_tabla = new Tabla(tabla);
        let res: Nodo;
        res = this.expresion.ejecutar(nueva_tabla, arbol);
        if (res instanceof Errror) {
            return res;
        }
        let def = true;
        let cont_def = null;
        for(let i = 0; i <  this.contenido.length; i++){
            let cases = this.contenido[i];
            if(cases instanceof Case){
                if(res == cases.expresion.ejecutar(nueva_tabla, arbol)){
                    def = false;
                    const cont = cases.ejecutar(nueva_tabla, arbol);
                    if(cont instanceof Continue || cont instanceof Break){
                        return null;
                    }
               
                    if(cont instanceof Return){
                        return cont;
                    }
                    
                   
                }
            }else if(cases instanceof Default && cont_def == null){
                cont_def = cases;
            }
        }
        if(def == true && cont_def != null){
            const cont = cont_def.ejecutar(nueva_tabla, arbol);
            if(cont instanceof Return){
                return cont;
            }
            if(cont instanceof Continue || cont instanceof Break){
                return null;
            }
       
        }
        return null;
    }
}
export{Switch};