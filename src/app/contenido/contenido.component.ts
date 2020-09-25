import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

  constructor() { 
    
  }

  
  arbol:Arbol;
  tabla:Tabla;
  desanidacion = new Desanidar();
  abierto = true;
  @ViewChild('rep_p') id:ElementRef; 
  
  mostrar_tabla(val, id){
   this.id.nativeElement.style.display = 'block';
   let div = "<div style=\"display: block;\">";
    div += "<h4>Tabla #" + id + " de simbolos generada</h4>";
    div += val;
    div += "</div><br>"; 
    document.getElementById("tablas").innerHTML += div ;
    console.log("agregando tb");
   }
  ocultar_mod(){
     this.id.nativeElement.style.display = 'none';
  }
  mostrar_errores(){}
  mostrar_ts(){
    let i = 1;
    this.arbol.reportes.forEach(element => {
      this.mostrar_tabla(element, i);
      i++;
    });
  }
  ejecutar(entrada:string):void{
    
    document.getElementById("tablas").innerHTML ="";
           this.arbol = parser.parse(entrada);
      if(!this.desanidacion.hay_anidada(this.arbol)){
        //EJECUCION
        this.tabla = new Tabla(null);
        this.arbol = parser.parse(entrada);
       
        this.arbol.instrucciones.forEach(element => {
          if(element instanceof Funcion){
              element.guardar_funcion(this.tabla, this.arbol);
          }
        });

        this.arbol.instrucciones.forEach(element => {
          if(element instanceof Declaracion){
            element.ejecutar(this.tabla, this.arbol);
          }
        });

        this.arbol.instrucciones.forEach(element => {
          if(!(element instanceof  Declaracion) && !(element instanceof Funcion)){
              element.ejecutar(this.tabla, this.arbol);
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
      this.reporte_ast();
   
  }

  sentencias_ast(sent):any{
    if(sent instanceof If){
      return this.if_ast(sent);
    }else if(sent instanceof Declaracion){
      return this.declaracion_ast(sent);
    }else if(sent instanceof Asignacion){
      return this.asignacion_ast(sent);
    }else if(sent instanceof Break){
      return new Nodo_AST("Break",null,[]);
    }else if(sent instanceof Continue){
      return new Nodo_AST("Continue",null,[]);
    }else if(sent instanceof Return){
      return this.return_ast(sent);
    }else if(sent instanceof While){
      return this.while_ast(sent);
    }else if(sent instanceof Do_while){
      return this.do_while_ast(sent);
    }else if(sent instanceof Switch){
      return this.switch_ast(sent);
    }else if(sent instanceof For){
      return this.for_ast(sent);
    }/*else if(sent instanceof For_1){
    }*/else if(sent instanceof Imprimir){
      return this.imprimir_ast(sent);
    }else if(sent instanceof Llamada_funcion){
      return this.llamada_funcion_ast(sent);
    }else if(sent instanceof Funcion){
      return this.funcion_ast(sent);
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
    let padre = new Nodo_AST("Declaracion", null,[]);
    padre.children.push(this.tipo_ast("Tipo declaracion", sent.tipo_declaracion));
    padre.children.push(this.tipo_ast("Identificador", sent.id));
    padre.children.push(this.tipo_ast("Tipo de dato", sent.tipo));
    if(sent.valor != null){
      let valor =  new Nodo_AST("Valor", padre, [this.ast(sent.valor)]);
      padre.children.push(valor);
    }
    return padre;
  }

  asignacion_ast(sent: Asignacion){
    let padre = new Nodo_AST("Asignacion ", null,[]); 
    padre.children.push(this.tipo_ast("Identificador", sent.id));
    let valor =  new Nodo_AST("Valor", padre, [this.ast(sent.valor)]);
    padre.children.push(valor);
    return padre; 
  }

  imprimir_ast(sent: Imprimir){
    let padre = new Nodo_AST("Imprimir ", null,[]); 
    padre.children.push(this.ast(sent.expresion)); 
    return padre;
  }
  return_ast(sent: Return){
    let padre = new Nodo_AST("Return ", null,[]); 
    padre.children.push(this.ast(sent.condicion)); 
    return padre;
  }
  
  llamada_funcion_ast(sent: Llamada_funcion){
      let padre =  new Nodo_AST("LLamada Funcion " + sent.nombre, null, []);
      sent.parametros.forEach(element => {
        padre.children.push(this.ast(element));
      });
      return padre;
  }
  funcion_ast(sent: Funcion){
    let padre =  new Nodo_AST("Funcion ", null, []);
    padre.children.push(this.tipo_ast("Identificador", sent.nombre));
    
    if(sent.parametros.length > 0){
      let parametros = new Nodo_AST("Parametros ", padre, []);
      sent.parametros.forEach(element => {
        parametros.children.push(this.sentencias_ast(element));
      });
      padre.children.push(parametros);  
    }
    padre.children.push(this.tipo_ast("Tipo", sent.tipo));
    
    if(sent.contenido.length > 0){
      let contenido = new Nodo_AST("Contenido", padre,[]);
      sent.contenido.forEach(element => {
        contenido.children.push(this.sentencias_ast(element));
      });
      padre.children.push(contenido);  
    }
    
    return padre;
  }

  switch_ast(sent: Switch){
    let padre =  new Nodo_AST("Switch" , null, []);
    let exp1 = new Nodo_AST("Expresion", padre,[]);
    exp1.children.push(this.ast(sent.expresion));

    sent.contenido.forEach(element => {
      if(element instanceof Case){
          padre.children.push(this.case_ast(element));
      }else if(element instanceof Default){
        padre.children.push(this.default_ast(element));
      }
    });
    return padre;
  }
  case_ast(sent: Case){
    let padre =  new Nodo_AST("Case" , null, []);
    let exp1 = new Nodo_AST("Expresion", padre,[]);
    exp1.children.push(this.ast(sent.expresion));
    let contenido = new Nodo_AST("Contenido", padre,[]);
    sent.contenido.forEach(element => {
      contenido.children.push(this.sentencias_ast(element));
    });
    padre.children = [exp1, contenido];
    return padre;
  }
  default_ast(sent: Default){
    let padre =  new Nodo_AST("Default" , null, []);
    let contenido = new Nodo_AST("Contenido", padre,[]);
    sent.contenido.forEach(element => {
      contenido.children.push(this.sentencias_ast(element));
    });
    padre.children = [contenido];
    return padre;
  }

  for_ast(sent: For){
    let padre =  new Nodo_AST("For" , null, []);
    let exp1 = new Nodo_AST("Expresion 1", padre,[]);
    let exp2 = new Nodo_AST("Expresion 2", padre,[]);
    let exp3 = new Nodo_AST("Expresion 3", padre,[]);
    let contenido = new Nodo_AST("Contenido", padre,[]);
   
    exp1.children.push(this.sentencias_ast(sent.exp1));
    exp2.children.push(this.ast(sent.exp2));
    exp3.children.push(this.sentencias_ast(sent.exp3));

    sent.contenido.forEach(element => {
      contenido.children.push(this.sentencias_ast(element));
    });
    padre.children = [exp1, exp2, exp3, contenido];
    return padre;
  }

  for_1_ast(sent: For_1){
    
  }

  do_while_ast(sent: Do_while){
    let padre = new Nodo_AST("Do While", null,[]); 
    let condicion = new Nodo_AST("Condicion", padre,[]);
    let contenido = new Nodo_AST("Contenido", padre,[]);
    condicion.children.push(this.ast(sent.condicion));
    sent.contenido.forEach(element => {
      contenido.children.push(this.sentencias_ast(element));
    });
    padre.children = [condicion, contenido];
    return padre; 
  }

  ast(element):any{
    let exp = new Nodo_AST("E",null,[]);
    if(element instanceof Aritmetica || element instanceof Logica || element instanceof Relacional){     
      
      if(element.nodo_derecho != null){
          let izq: Nodo_AST= this.ast(element.nodo_izquierdo);
          izq.parent = exp;
          exp.children.push(izq);
          exp.children.push(new Nodo_AST(element.operador,exp,[]));
          let der: Nodo_AST= this.ast(element.nodo_derecho);
          der.parent = exp;
          exp.children.push(der);
      }else{
        exp.children.push(new Nodo_AST(element.operador,exp,[]));
        let izq: Nodo_AST= this.ast(element.nodo_izquierdo);
        exp.children.push(izq);          
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

  tipo_ast(tipo, valor){
    return new Nodo_AST(tipo, null,[new Nodo_AST(valor, null, [])]);
  }

  reporte_ast(){
    if (document.getElementById("grafo")) {
      document.getElementById("grafo").remove();
    }
   
    let raiz = new Nodo_AST("Raiz",null,[]);  
    this.arbol.instrucciones.forEach(element => {
      raiz.children.push(this.sentencias_ast(element));      
    });
    generateTree([raiz]); 
  }
  ngOnInit(): void {
    
  }


}
