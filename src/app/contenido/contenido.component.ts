import { Component, OnInit } from '@angular/core';
import {Arbol} from './AST/Arbol';
import {Tabla} from './AST/Tabla';
import {Imprimir} from './Instrucciones/Imprimir';
import {Primitivo} from './Expresiones/Primitivo';
import { Errror } from './AST/Errror';
const parser  = require('./analizador.js');

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent implements OnInit {

  constructor() { }

  
  
  traducir(entrada:string):void{
    let arbol = parser.parse(entrada);
    const tabla = new Tabla(null);
    console.log(arbol);
    arbol.instrucciones.map((m: any) =>{
      const res = m.ejecutar(tabla, arbol);
      
    });
    console.log(arbol);
    console.log(arbol.consola);
    let salida = "";
    arbol.consola.forEach(element => {
      salida += element + "\n";
    });
    document.getElementById('txt_consola').innerHTML = salida;  
  }
  ngOnInit(): void {
    
  }

}
