import { Component, OnInit } from '@angular/core';

import {Desanidar} from './Complemento/Desanidar';

import {Arbol} from './AST/Arbol';
import {Tabla} from './AST/Tabla';
import {Imprimir} from './Instrucciones/Imprimir';
import {Asignacion} from './Instrucciones/Asignacion';
import {Identificador} from './Instrucciones/Identificador';
import {Declaracion} from './Instrucciones/Declaracion';
import {If} from './Instrucciones/If';
import {While} from './Instrucciones/While';
import {Do_while} from './Instrucciones/Do_while';
import {Funcion} from './Instrucciones/Funcion';
import {Llamada_funcion} from './Instrucciones/Llamada_funcion';
import {Ternario} from './Instrucciones/Ternario';
import {For} from './Instrucciones/For';
import {For_1} from './Instrucciones/For_1';
import {Switch} from './Instrucciones/Switch';
import {Case} from './Instrucciones/Case';
import {Default} from './Instrucciones/Default';




import {Primitivo} from './Expresiones/Primitivo';
import {Aritmetica} from './Expresiones/Aritmetica';
import {Relacional} from './Expresiones/Relacional';
import {Logica} from './Expresiones/Logica';
import {Break} from './Expresiones/Break';
import {Continue} from './Expresiones/Continue';
import {Return} from './Expresiones/Return';
import { Errror } from './AST/Errror';
import { Nodo_AST } from './AST/Nodo_AST';
import { Nodo } from './AST/Nodo';
const parser  = require('./analizador.js');

  declare var generateTree;
  
@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent implements OnInit {

  constructor() { }

  
  arbol:Arbol;
  tabla:Tabla;
  desanidacion = new Desanidar();
  

  ejecutar(entrada:string):void{
      this.arbol = parser.parse(entrada);
      if(!this.desanidacion.hay_anidada(this.arbol)){
        //EJECUCION
        this.tabla = new Tabla(null);
        if (document.getElementById("grafo")) {
          document.getElementById("grafo").remove();
        }
        this.arbol = parser.parse(entrada);
        this.arbol.instrucciones.map((m: any) =>{
          if(m instanceof Funcion){
              m.guardar_funcion(this.tabla, this.arbol);
          }else{
            const res = m.ejecutar(this.tabla, this.arbol);
          }
        });

        console.log(this.tabla);
        let salida = "";
        this.arbol.consola.forEach(element => {
          if(element instanceof Errror){
            salida += element.desc + "\n";
    
          }else{
            salida += element + "\n";
          }
        });
        console.log(this.arbol);
        document.getElementById('txt_consola').innerHTML = salida;
        this.reporte_ast();
      }else{
          alert("No puede ejecutar si hay funciones anidadas");
      }
  }

  traducir(entrada:string):void{
    
    let a = "10";

    for(let i of a){
        console.log(a[0]);
    }


      this.arbol = parser.parse(entrada);     
      let resultado = this.desanidacion.desanidar(this.arbol);
      document.getElementById('txt_traduccion').innerHTML = resultado;
   
  }

  reporte_ast(){
    let results = new Nodo_AST("Instrucciones",null,[]);
    
    this.arbol.instrucciones.forEach(element => {
      let padre = new Nodo_AST("",null,[]);
      let hijo: Nodo_AST;
     
      if(element instanceof Imprimir){
            padre.name = "Imprimir";
            hijo = this.ast(element.expresion);
            
        }else if(element instanceof Declaracion){
          padre.name = "Declaracion " + element.id;
          hijo = this.ast(element.valor);
        }else if(element instanceof Asignacion){
          padre.name = "Asignacion " + element.id;
          hijo = this.ast(element.valor);
        }else if(element instanceof If){
          padre.name = "If";
          hijo = this.ast(element);
        }  
        if(padre.name != ""){
          hijo.parent = padre;
          padre.children.push(hijo);
          padre.parent = results;
          results.children.push(padre);
        }    
    });
    results.children.push(new Nodo_AST("S",null,[]));
    generateTree([results]); 
  }
  ast(element):any{
    let exp = new Nodo_AST("E",null,[]);
    if(element instanceof Aritmetica || element instanceof Logica){     
      if(element.nodo_izquierdo != null){
          let izq: Nodo_AST= this.ast(element.nodo_izquierdo);
          izq.parent = exp;
          exp.children.push(izq);
        }

        exp.children.push(new Nodo_AST(element.operador,exp,[]));
   
        if(element.nodo_derecho != null){
          let der: Nodo_AST= this.ast(element.nodo_derecho);
          der.parent = exp;
          exp.children.push(der);
      } 
    }else if(element instanceof Primitivo){
      let hijo = new Nodo_AST(element.valor.toString(), null, []);
      let e = new Nodo_AST("E",null,[hijo]);
   
      return e;
    }else if(element instanceof Identificador){
      let valor = this.tabla.get_var(element.id);
      let hijo = new Nodo_AST(element.id.toString(), null, []);
      let nieto = new Nodo_AST(valor.valor.toString(), null, []);
      hijo.children.push(nieto);
      nieto.parent = hijo;
      let e = new Nodo_AST("E",null,[hijo]);
   
      return e; 
    }
    return exp;
  }
  ngOnInit(): void {
    
  }


}
