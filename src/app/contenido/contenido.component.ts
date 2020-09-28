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
import {Typo} from './Instrucciones/Typo';
import {Set_type, Type_object} from './Instrucciones/Type_object';
import {Llamada_type} from './Instrucciones/Llamada_type';
import {Arreglo, Push, Pop, Length, SD_Arreglo, GD_Arreglo} from './Instrucciones/Arreglo';




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
import { Reporte_AST } from './Complemento/Reporte_AST';
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

  traducido:boolean = false;
  arbol:Arbol;// "Arbol" de analisis sintactico y semantico
  tabla:Tabla;// tabla de simbolos
  desanidacion = new Desanidar();// instancia a la clase desanidacion 
  reporte_ast = new Reporte_AST();// instancia a la clase reporte ast
  
  @ViewChild('rep_p') id:ElementRef; // obtener el div flotante
  @ViewChild('rep_ast') rep_ast:ElementRef; // obtener el div flotante
  
  //Metodo que muestra un div flotante con un valor y un titulo...
  mostrar_tabla(val, titulo){
   this.id.nativeElement.style.display = 'block';// poner visible el display
   let div = "<div style=\"display: block;\">";
    div += "<h4>" + titulo + "</h4>"; // agregar el titulo al div
    div += val;
    div += "</div><br>"; 
    document.getElementById("tablas").innerHTML += div ;// agregar el valor al div
   }

  /**Metodo que oculta el div generico */ 
  ocultar_mod(){
     this.id.nativeElement.style.display = 'none';
  }
  /**Metodo que oculta el div generico */ 
  ocultar_ast(){
    this.rep_ast.nativeElement.style.display = 'none';
 }
  /** Metodo que muestra las tablas de simbolos generadas durante la ejecucion */
  mostrar_ts(){
    let i = 1;
    this.arbol.reportes.forEach(element => {// Recorrer las tablas generadas
      this.mostrar_tabla(element, "Tabla #" + i + " de simbolos generada");
      i++;
    });
  }
  
  mostrar_errores(){
      let t_errores = "<table class=\"table table-striped table-hover\">";
      t_errores += "<tr><td>TIPO</td><td>DESCRIPCION</td><td>LINEA</td><td>COLUMNA</td></tr>";
      this.arbol.errores.forEach(e => {
        t_errores += "<tr><td>" + e.tipo + "</td><td>" + e.desc + "</td><td>" + e.linea +"</td><td>" + e.columna + "</td></tr>";
      });
      t_errores += "</table>";
      this.mostrar_tabla(t_errores, "ERORES");
  }

  ejecutar_(entrada){
      try{
        document.getElementById("tablas").innerHTML ="";// limpiando el div que contiene tablas de erores y ts
   
        this.arbol = parser.parse(entrada);// obtener el rbol del analisis sintactico
        this.pasadas();
      }catch(e){
         alert("Error no encontrado :(");
        
      }
  }

  pasadas(){
   try{
    if(!this.desanidacion.hay_anidada(this.arbol)){// preguntar si existe alguna funcion anidada...
      //EJECUCION
      this.tabla = new Tabla(null); // Inicializar la tabla de simbolos
      this.arbol.instrucciones.forEach(element => {//primeraa pasada para guardar las funciones declaradas
        if(element instanceof Funcion){
            element.guardar_funcion(this.tabla, this.arbol);
        }
      });
      this.arbol.instrucciones.forEach(element => { // tercera pasada para guardar los tyipos
        if(element instanceof Typo){
          element.ejecutar(this.tabla, this.arbol);
        }
      });
      
      this.arbol.instrucciones.forEach(element => {//segunda pasada para guardar las variables
        if(element instanceof Type_object){
          element.ejecutar(this.tabla, this.arbol);
        }
      });
      this.arbol.instrucciones.forEach(element => {//segunda pasada para guardar las variables
        if(element instanceof Declaracion || element instanceof Set_type || element instanceof Asignacion){
          element.ejecutar(this.tabla, this.arbol);
        }
      });
      
      this.arbol.instrucciones.forEach(element => {// Ultima pasada para ejecutar algo distinto a lo anterior
        if(!(element instanceof  Declaracion) && !(element instanceof Funcion)
        && !(element instanceof Typo) && !(element instanceof Type_object)){
            element.ejecutar(this.tabla, this.arbol);
        }
      });
      let salida = "";
      this.arbol.consola.forEach(element => {// obtener los resultados de consola
          salida += element + "\n";
      });
      console.log(this.arbol);
      document.getElementById('txt_consola').innerHTML = salida;// mostrarlos en la secicon de consola
    }else{
        alert("No puede ejecutar si hay funciones anidadas");
    }
   }catch(e){
      alert("Error no encontrado");
   }
   
  }
  /*Metodo que ejecuta las sentencias obtenidas del analisis sintactico*/
  ejecutar(entrada:string):void{
    if(this.traducido){
      this.pasadas();
      this.traducido = false;
    }else{
      this.ejecutar_(entrada);
    }

  }

 /*Metodo para traducir la entrada inicial*/ 
  traducir(entrada:string):void{
    this.traducido = true;
    document.getElementById("tablas").innerHTML ="";// limpiando el div que contiene tablas de erores y ts
 
    this.arbol = parser.parse(entrada);// obtener el analisis lexico y sintactico desde el parser     
    let resultado = this.desanidacion.desanidar(this.arbol);// obtener la desanidacion y traduccion
    document.getElementById('txt_traduccion').innerHTML = resultado;  // mostrar la traduccion en el text area
   }

/* Metodo para generar el arbol ast*/
  generar_AST(){
    this.rep_ast.nativeElement.style.display = 'block';// poner visible el display
  
    if (document.getElementById("grafo")) {// Remover el grafo anterior del html
      document.getElementById("grafo").innerHTML = "";
    }
    let raiz = this.reporte_ast.get_Report(this.arbol);//obtener el arbol normalizado: name, parent, childrem
    if(raiz != null){
      generateTree([raiz]); //generar el grafo desde el script charts.js
    }
  }
  ngOnInit(): void {
    
  }


}
