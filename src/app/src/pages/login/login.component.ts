import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { trim } from 'lodash';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario = {
    nombreUsuario: '',
    contrasena: '',
    empresa:''
  }
  recordarme = false;

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.usuario.empresa=localStorage.getItem('emp');
      this.usuario.nombreUsuario = localStorage.getItem('user');
      this.recordarme=true;
    }
  }

  login(form: NgForm) {
    Swal.fire({
      title: 'Cargando...',
      focusCancel:false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    if (form.invalid) { return Swal.fire({icon:'warning',text:'Ingrese sus datos correctamente!'}); }
    var formulario:any=this.usuario;
    formulario.empresa=trim(formulario.empresa).toLowerCase();
    formulario.nombreUsuario=trim(formulario.nombreUsuario).toLowerCase();
    formulario.contrasena=trim(formulario.contrasena).toLowerCase();
    this.auth.login(formulario).subscribe((res:any) => {
      if (Object.entries(res).length > 0) {
        if (this.recordarme) {
          localStorage.setItem('user', this.usuario.nombreUsuario);
          localStorage.setItem('emp', this.usuario.empresa.toLowerCase());
        }else{
          localStorage.removeItem('user');
          localStorage.removeItem('emp');
        }
        Swal.close();
        localStorage.setItem('token',res.token);
        localStorage.setItem('emp',this.usuario.empresa.toLowerCase());
        localStorage.setItem('access', 'true');
        this.router.navigateByUrl('admin');
      } else {
        Swal.fire({
          title: 'Mensaje',
          icon: 'warning',
          text: 'No se encontro ningun usuario'
        })
      }
    },  err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    });

  }

}
