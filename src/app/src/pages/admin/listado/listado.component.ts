import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Asistencia } from 'src/app/models/asistencia.interface';
import { NgForm, UntypedFormControl } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {

  constructor(public aut: AuthService, private domSanitizer: DomSanitizer, private modalService: NgbModal) {
    var hoy = new Date()
    var fecha = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
    var hora = ('0' + hoy.getHours()).slice(-2) + ':' + ('0' + hoy.getMinutes()).slice(-2);
    var fecha_hora = fecha + 'T' + hora;
    this.fechaActual = fecha_hora;
  }
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  fechaActual = '';
  asistencias: any = [];
  selected: Date | null;
  closeResult = '';//viene del modal
  ip_public = '';
  ae = 1;
  asistencia = { cod_empleado: 0, fecha: this.fechaActual, identificador: '' } as Asistencia;
  empleados = [];
  filterAsistencia: string = '';
  fecha1: string;
  fecha2: string;
  ngOnInit(): void {
    this.cargarAsistencia();
    this.aut.buscarIp().subscribe((res: any) => {
      this.ip_public = res.ip;
    });
    this.ListarEmpleado();
    var fecha = new Date();
    fecha.setDate(fecha.getDate());
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
  }
  cargarAsistencia() {
    Swal.showLoading();
    this.aut.obtenerAsistencia().subscribe((res: any[]) => {
      Swal.close();
      this.asistencias = res;
    }, error => { Swal.close(); });
  }
  enviarAsistencia(formulario: NgForm, crud: boolean) {
    if (formulario.invalid) { return; }
    formulario.value.ip_public = this.ip_public;
    if (crud) {
      this.aut.updateAsistencia(formulario.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', text: 'Se actualizó con éxito' });
        formulario.resetForm();
        this.cargarAsistencia();
      }, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' }); });
    }
    else {
      this.validarEmpresaLocalStorage();
      this.aut.crearAsistencia(formulario.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', text: 'Se actualizó con éxito' });
        formulario.resetForm();
        this.cargarAsistencia();
      },
        err => { Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' }); }
      );
    }
  }
  validarEmpresaLocalStorage() {
    if (localStorage.getItem('token') == null) { return Swal.fire({ icon: 'warning', text: 'La empresa no esta asginada, vuelva a logearse' }) }
  }
  mostrarImagen(imagen) {
    if (typeof (imagen) != 'undefined') {
      this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + imagen);
      var img = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + imagen);
      return Swal.fire({ html: '<img style="max-width:500px" src="' + 'data:image/jpg;base64,' + imagen + '">', showConfirmButton: false });
    } else {
      return this.domSanitizer.bypassSecurityTrustUrl('');
    }
  }
  busquedaAsistenciaRango() {
    this.aut.rangoAsistencia(this.fecha1, this.fecha2).subscribe((res: []) => { this.asistencias = res })
  }
  updateAsitencia(id, identificador) {
    Swal.fire({
      title: 'Esta seguro de actualizar a ' + identificador + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.aut.updateAsistencia({ id: id, identificador: identificador }).subscribe(() => {
          Swal.fire({
            title: 'Actualizado!',
            icon: 'success'
          })
          this.cargarAsistencia();
        }, error => {
          Swal.fire({
            title: 'Hubo un error en la conexión!',
            icon: 'error'
          })
        })
      }
    })
  }
  abrirModalAsistencia(content) {
    this.asistencia.fecha = this.fechaActual;
    this.modalService.open(content, { size: 'lg', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  enviar(form: NgForm) {
    if (form.invalid) {
      return;
    }//si el formulario es invalido no hace nada;
    form.value.ip_public = this.ip_public;
    this.aut.crearAsistencia(form.value).subscribe(() => {
      this.modalService.dismissAll();
      this.busquedaAsistenciaRango();
      this.asistencia = { cod_empleado: 0, fecha: this.fechaActual, identificador: '' };
      setTimeout(() => {
        this.Toast.fire({
          icon: 'success',
          title: 'Se creó con exito'
        })
      }, 200);
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  ListarEmpleado() {
    this.aut.getListaEmpleados().subscribe((res: any[]) => {
      this.empleados = res;
    });
  }
}
