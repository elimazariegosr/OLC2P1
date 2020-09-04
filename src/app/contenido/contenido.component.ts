import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent implements OnInit {

  constructor() { }

  
  analizar(entrada:string):void{
    console.log(entrada);
  }
  ngOnInit(): void {
    
  }

}
