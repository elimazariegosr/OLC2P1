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
        super(tipo, linea, columna);
        this.nombre = nombre;
        this.contenido = contenido;
        this.parametros = parametros;
        this.generar_id();
        this.guardada = false;
        this.cont_parametros = [];
        this.tipo = tipo;
        console.log("TIPOOO: " + tipo);
    }
    
    guardar_funcion(tabla: Tabla, arbol:Arbol){
        let simbolo: Simbolo;
        simbolo = new Simbolo(this.tipo, this.id, this);
        const resp = tabla.set_var(simbolo);
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
        const nueva_tabla = new Tabla(tabla);
        let val  = null;
        for(let i = 0;i < this.parametros.length; i++){
            this.parametros[i].valor = this.cont_parametros[i];
            let valor = this.parametros[i].ejecutar(nueva_tabla,arbol);
            if(valor instanceof Errror){
                return valor;
            }
        }
        this.contenido.forEach(element => {
           if(element instanceof Return){
                val = element.condicion.ejecutar(nueva_tabla,arbol);
                console.log(val);
                return val;
           }
            let res = element.ejecutar(nueva_tabla,arbol);
            if(res instanceof Errror){

            }
        });
        return val;
    }
}

export {Funcion};