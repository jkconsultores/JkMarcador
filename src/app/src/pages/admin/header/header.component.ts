import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(public rout: Router) { }

  ngOnInit(): void {
  }
  salir(){
    localStorage.removeItem('access');
    this.rout.navigateByUrl('empleado');
  }

}
