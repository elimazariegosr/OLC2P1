import { Component, OnInit } from '@angular/core';
import {Arbol} from './AST/Arbol';
import {Tabla} from './AST/Tabla';
import {Imprimir} from './Instrucciones/Imprimir';
import {Primitivo} from './Expresiones/Primitivo';
import {Aritmetica} from './Expresiones/Aritmetica';
import {Identificador} from './Instrucciones/Identificador';
import {Declaracion} from './Instrucciones/Declaracion';
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
  tabla = new Tabla(null);
    
  traducir(entrada:string):void{
    if (document.getElementById("grafo")) {
      document.getElementById("grafo").remove();
    }
 
    this.arbol = parser.parse(entrada);
    this.arbol.instrucciones.map((m: any) =>{
      const res = m.ejecutar(this.tabla, this.arbol);
    });
    let salida = "";

    let results = new Nodo_AST("Instrucciones",null,[]);
    this.arbol.instrucciones.forEach(element => {
        if(element instanceof Imprimir){
            let padre = new Nodo_AST("Imprimir",null,[]);
            let hijo: Nodo_AST = this.ast(element.expresion);
            hijo.parent = padre;
            padre.children.push(hijo);
            padre.parent = results;
            results.children.push(padre);
        }else if(element instanceof Declaracion){
          let padre = new Nodo_AST("Declaracion",null,[]);
          let hijo: Nodo_AST = this.ast(element.valor);
          hijo.parent = padre;
          padre.children.push(hijo);
          padre.parent = results;
          results.children.push(padre);
        }

    });
    generateTree([results]);
    this.arbol.consola.forEach(element => {
      salida += element + "\n";
    });
    document.getElementById('txt_consola').innerHTML = salida;  
  }

  ast(element):any{
    let exp = new Nodo_AST("E",null,[]);
    if(element instanceof Aritmetica){
      
      if(element.nodo_derecho != null){
        let der: Nodo_AST= this.ast(element.nodo_derecho);
        der.parent = exp;
        exp.children.push(der);
    }
    exp.children.push(new Nodo_AST(element.operador,exp,[]));
      
      if(element.nodo_izquierdo != null){
          let izq: Nodo_AST= this.ast(element.nodo_izquierdo);
          izq.parent = exp;
          exp.children.push(izq);
        } 
        
        
    }else if(element instanceof Primitivo){
      let hijo = new Nodo_AST(element.valor.toString(), null, []);
      return hijo;
    }else if(element instanceof Identificador){
      let valor = this.tabla.get_var(element.id);
      let hijo = new Nodo_AST(element.id.toString(), null, []);
      let nieto = new Nodo_AST(valor.valor.toString(), null, []);
      hijo.children.push(nieto);
      nieto.parent = hijo;
      return hijo; 
    }
    return exp;
  }
  ngOnInit(): void {
    
  }


}
