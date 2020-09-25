import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Tabla } from '../AST/Tabla';
import { tipos } from '../AST/Tipo';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Primitivo } from '../Expresiones/Primitivo';
import { Return } from '../Expresiones/Return';
import { Declaracion } from './Declaracion';

class For_1 extends Nodo{


    variable: string;
    id: string;
    tipo_for: string;
    contenido: Array<Nodo>;


    constructor(variable: string, tipo_for: string,id: string, contenido: Array<Nodo>, linea: number, columna: number){
        super(null, linea, columna);
        this.variable = variable;
        this.tipo_for = tipo_for;
        this.id = id;
        this.contenido = contenido;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        let res = tabla.get_var(this.id);
        let fin;
        if(res.tipo.type == tipos.STRING){
            fin = res.valor.toString().length;
            if(this.tipo_for == "in"){
                // error
            }
        }else if(res.tipo.type != tipos.ARREGLO){
            //error
        }
        
        let nueva_tabla = new Tabla(tabla);
        for(let i = 0; i < fin; i++){
            let dec:Declaracion;
            if(this.tipo_for == "of"){
                dec = new Declaracion("let", res.tipo, this.variable, null, this.linea, this.columna);
                if(res.tipo.type == tipos.STRING){
                    dec.valor = new Primitivo(res.tipo, res.valor[i],this.linea, this.columna);
                }    
            }
            dec.ejecutar(nueva_tabla, arbol);
            for (let j = 0; j < this.contenido.length; j++) {
                const cont = this.contenido[j].ejecutar(nueva_tabla, arbol);
                if(cont instanceof Continue || cont instanceof Break || cont instanceof Return){
                    return cont;
                }
            }
            nueva_tabla = new Tabla(tabla);   
        }
    }
}
export {For_1};