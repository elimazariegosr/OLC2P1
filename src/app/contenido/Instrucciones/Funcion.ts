import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {Errror} from '../AST/Errror';
import { Simbolo } from '../AST/Simbolo';
import {tipos} from '../AST/Tipo';
import { Return } from '../Expresiones/Return';
import { Declaracion } from './Declaracion';

class Funcion extends Nodo{

    nombre: string;
    id: string;
    parametros: Array<Declaracion>;
    cont_parametros: Array<Nodo>;
    contenido: Array<Nodo>;
    guardada: boolean;
  
    constructor(nombre: string, parametros: Array<Declaracion>, contenido: Array<Nodo>, tipo:Tipo, linea: number, columna: number){
        if(tipo == null){
            tipo = new Tipo(tipos.ANY);
        }
        super(tipo, linea, columna);
        this.nombre = nombre;
        this.contenido = contenido;
        this.parametros = parametros;
        this.generar_id();
        this.guardada = false;
        this.cont_parametros = [];
    }

    guardar_funcion(tabla: Tabla, arbol:Arbol){
        let simbolo: Simbolo;
        simbolo = new Simbolo(this.tipo, this.id, this, this.linea, this.columna);
        const resp = tabla.set_variable(simbolo);
        if(resp != null){
            const error = new Errror('Semantico',"Ya esta declarada la funcion", this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
        }
    }

    generar_id(){
        this.id = "funcion#_" + this.nombre;
    }
    
    ejecutar(tabla: Tabla, arbol: Arbol):Object{
        let val = null;
        const nueva_tabla = new Tabla(tabla);
        let cont_aux = [];
        for(let i = 0; i < this.parametros.length; i++){
            this.parametros[i].valor = this.cont_parametros[i];
            cont_aux.push(this.parametros[i]);
        }
        this.contenido.forEach(element => {
            cont_aux.push(element);
        });

        for(let i = 0; i < cont_aux.length; i++){
            let res = cont_aux[i].ejecutar(nueva_tabla,arbol);
            if(res instanceof Return){
                if(res.tipo.type != this.tipo.type && this.tipo.type != tipos.ANY){
                    const error = new Errror('Semantico',"El tipo de dato del return no es igual al de la funcion", this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString()); 
                    return "Undefined";    
                }
                if(res.valor != null){
                    return res.valor;
                }
                return null;
            }
        }
        return null;
    }
}

export {Funcion};