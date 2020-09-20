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
    
      this.arbol = parser.parse(entrada);     
      let resultado = this.desanidacion.desanidar(this.arbol);
      document.getElementById('txt_traduccion').innerHTML = resultado;
   
  }

  sentencias_ast(sent):any{
    if(sent instanceof If){
      return this.if_ast(sent);
    }else if(sent instanceof Declaracion){
      return this.declaracion_ast(sent);
    }else if(sent instanceof Asignacion){
      return this.asignacion_ast(sent);
    }else if(sent instanceof Break){
    }else if(sent instanceof Continue){
    }else if(sent instanceof Return){
    }else if(sent instanceof While){
      return this.while_ast(sent);
    }else if(sent instanceof Do_while){
    }else if(sent instanceof For){
    }else if(sent instanceof For_1){
    }else if(sent instanceof Imprimir){
    }else if(sent instanceof Llamada_funcion){
    } 
  }
  if_ast(sent:If):any{
    let padre = new Nodo_AST("If", null,[]); 
    let condicion = new Nodo_AST("Condicion", padre,[]);
    let cont_if = new Nodo_AST("Contenido If", padre,[]);
    let cont_else = new Nodo_AST("Contenido Else", padre,[]);
    condicion.children.push(this.ast(sent.condicion));
    sent.lista_if.forEach(element => {
      cont_if.children.push(this.sentencias_ast(element));
    });
    sent.lista_else.forEach(element => {
      cont_else.children.push(this.sentencias_ast(element));
    });       
    padre.children = [condicion, cont_if, cont_else];
    return padre;
  }
  while_ast(sent: While){
    let padre = new Nodo_AST("While", null,[]); 
    let condicion = new Nodo_AST("Condicion", padre,[]);
    let contenido = new Nodo_AST("Contenido", padre,[]);
    condicion.children.push(this.ast(sent.condicion));
    sent.contenido.forEach(element => {
      contenido.children.push(this.sentencias_ast(element));
    });
    padre.children = [condicion, contenido];
    return padre;
  }

  declaracion_ast(sent: Declaracion){
    let padre = new Nodo_AST("Declaracion " + sent.id, null,[]); 
    padre.children.push(this.ast(sent.valor)); 
    return padre;
  }
  asignacion_ast(sent: Asignacion){
    let padre = new Nodo_AST("Asignacion " + sent.id, null,[]); 
    padre.children.push(this.ast(sent.valor)); 
    return padre; 
  }
  
  llamada_funcion_ast(sent: Llamada_funcion){
      let padre =  new Nodo_AST("LLamada Funcion " + sent.nombre, null, []);
      sent.parametros.forEach(element => {
        padre.children.push(this.ast(element));
      });
      return padre;
  }


  

  ast(element):any{
    let exp = new Nodo_AST("E",null,[]);
    if(element instanceof Aritmetica || element instanceof Logica || element instanceof Relacional){     
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
      let hijo = new Nodo_AST(element.id.toString(), null, []);
      let e = new Nodo_AST("E",null,[hijo]); 
      return e; 
    }else if(element instanceof Llamada_funcion){
      let hijo = this.llamada_funcion_ast(element);
      let e = new Nodo_AST("E",null,[hijo]); 
      return e;
    }
    return exp;
  }

  reporte_ast(){
    let raiz = new Nodo_AST("Raiz",null,[]);  
    this.arbol.instrucciones.forEach(element => {
      raiz.children.push(this.sentencias_ast(element));      
    });
    generateTree([raiz]); 
  }
  ngOnInit(): void {
    
  }


}
