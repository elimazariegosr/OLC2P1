import {Nodo} from '../AST/Nodo';
import {Tabla} from '../AST/Tabla';
import {Arbol} from '../AST/Arbol';
import {Tipo} from '../AST/Tipo';
import {Errror} from '../AST/Errror';
import { Simbolo } from '../AST/Simbolo';
import {tipos} from '../AST/Tipo';
import { Funcion } from '../Instrucciones/Funcion';
import { Expression } from '@angular/compiler';


class Llamada_funcion extends Nodo{
    nombre: string;
    parametros: Array<Nodo>;
    funcion: Object;
    id: string;
    constructor(nombre:string, parametros: Array<Nodo>, linea:number, columna:number){
        super(null,linea, columna);
        this.nombre = nombre;
        this.parametros = parametros;
    }
    generar_id(){
        this.id = "funcion#_" + this.nombre;        
    }
    get_tipo_(tabla: Tabla){
        this.generar_id();
        this.buscar_funcion(tabla);
        return this.tipo;
    }
    get_tipo(){
        return this.tipo;
    }

    buscar_funcion(tabla:Tabla){
        this.generar_id();
        let val = tabla.get_var(this.id);
        if(val != null){
            this.funcion =  val.valor;
            this.tipo = new Tipo(tipos.ANY);
            if(this.funcion instanceof Funcion){
                this.tipo = this.funcion.tipo;
            }

        }
    }
    ejecutar(tabla:Tabla, arbol:Arbol):Object{
        this.buscar_funcion(tabla);
        this.graficar_ts();
        if(this.funcion instanceof Funcion){
            if(this.funcion.parametros.length != this.parametros.length){
                const error = new Errror('Semantico',
                "Error en llamada de funcion: \"" + this.id + "\". La cantidad de parametros no cumple." ,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
            let si_llama = true;
            for(let  i = 0; i < this.funcion.parametros.length; i++){
                let tipo2:Tipo = null;
                let parametro = this.parametros[i];
                if(parametro instanceof Llamada_funcion){
                    parametro.get_tipo_(tabla);
               
                }
                parametro.ejecutar(tabla,arbol);
                tipo2 = parametro.get_tipo();
                if(this.funcion.parametros[i].tipo.type != tipo2.type){
                    si_llama = false;
                }
            }
            if(!si_llama){
                const error = new Errror('Semantico',
                "Error en llamada de funcion: " + this.id + " El orden de parametros no cumple." ,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
            for(let i = 0; i <  this.parametros.length; i++){
                this.funcion.cont_parametros[i] = this.parametros[i];
            }
            let ast = this.funcion.ejecutar(tabla, arbol);
            console.log(ast);
            return ast;
        }else{
            const error = new Errror('Semantico',
            "Error en llamada de funcion sin declarar: " + this.nombre + " ." ,
            this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;

        }
    }
}

export{Llamada_funcion};