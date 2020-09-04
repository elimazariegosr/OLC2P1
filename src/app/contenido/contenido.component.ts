import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent implements OnInit {

  constructor() { }

  
  traducir(entrada:string):void{
    console.log(entrada);
  }
  ngOnInit(): void {
    
  }

}
