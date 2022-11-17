import { Asistencia } from 'src/app/models/asistencia.interface';
import { NgForm, FormsModule } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ExcelService } from '../services/export-excel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  empleado: EmpleadoModel = {
    id: null,
    nombre: '',
    num_doc: '',
    tipo_doc: '01',
    local: '',
    descripcion: '',
    codigo: null
  };
  reportEmpleadoNombre='';
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
  // listadoEmpleado = [];//llenar el select con los datos del empleado
  local: any = [];
  closeResult = '';//viene del modal
  filterpost: string = '';
  HorasTrabajadas: any = [];//horas trabajadas de asistencia
  asistenciaEmpleado: any = [];
  empleados: any = [];
  empleado_p: number = 1;
  po: number = 1;
  p: number = 1;
  ae: number = 1;
  fecha1: string;
  fecha2: string;
  fecha1Asistencia: string;
  fecha2Asistencia: string;
  id_empleado: string;//dato para obtener asistencia del empleado
  @Input() empleadoObj: any;
  empleadoObj2 = {} as EmpleadoModel;
  @Input() asistenciaObj: Asistencia;

  constructor(public aut: AuthService,
    private domSanitizer: DomSanitizer,
    private excelService: ExcelService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    var fecha = new Date();
    fecha.setDate(fecha.getDate());
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
    this.fecha1Asistencia = fecha.toJSON().slice(0, 10);
    this.fecha2Asistencia = fecha.toJSON().slice(0, 10);
    this.aut.getLocales().subscribe((res) => {
      this.local = res;
    });
    this.ListarEmpleado();
  }

  async enviar(formulario: NgForm) {
    if (formulario.invalid) { return; }//si el formulario es invalido no hace nada
    if (this.empleado.id == null) {
      this.aut.insertEmpleado(formulario.value).subscribe(() => {
        this.modalService.dismissAll();
        formulario.resetForm();
        this.empleado = {
          id:null,
          nombre: '',
          num_doc: '',
          tipo_doc: '01',
          local: '',
          descripcion: '',
          codigo: null
        }
        this.ListarEmpleado();
        return setTimeout(() => {
          this.Toast.fire({
            icon: 'success',
            title: 'Se creó con éxito'
          })
        }, 200);
      },
        err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        })
    }
    else{
      this.aut.updateEmpleado(formulario.value).subscribe(() => {
        this.modalService.dismissAll();
        formulario.resetForm();
        this.ListarEmpleado();
        this.Toast.fire({
          icon: 'success',
          title: 'Se actualizó con éxito'
        })
      },
      err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      })
    }

  }

  ListarEmpleado() {
    this.aut.getListaEmpleados().subscribe((res: any[]) => {
      this.empleados = res;
    });
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
          this.busquedaAsistenciaEmpleado();
        }, error => {
          Swal.fire({
            title: 'Hubo un error en la conexión!',
            icon: 'error'
          })
        })
      }
    })
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

  openReport(content, id_empleado,nombre) {
    this.reportEmpleadoNombre=nombre;
    this.id_empleado = id_empleado;
    this.asistenciaEmpleado = [];
    this.busquedaAsistenciaEmpleado();
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
  busquedaAsistenciaEmpleado() {
    this.aut.getAsistenciaEmpleado(this.fecha1, this.fecha2, this.id_empleado).subscribe((res: []) => {
      this.asistenciaEmpleado = res;
    })
  }
  reporteEmpleado() {
    this.excelService.exportAsExcelFile(this.asistenciaEmpleado, 'Reporte Empleado');
  }
  abrirNuevoEmpleado(modal) {
    this.empleado = {
      id: null,
      nombre: '',
      num_doc: '',
      tipo_doc: '01',
      local: '',
      descripcion: '',
      codigo: null
    };
    this.modalService.open(modal, { size: 'lg', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateEmpleado() {

  }
  EditarCampos(modal, id, local, codigo, activo, nombre, num_doc, tipo_doc) {
    this.empleado = {
      id: id,
      nombre: nombre,
      num_doc: num_doc,
      tipo_doc: tipo_doc,
      local: local,
      codigo: codigo,
      activo: activo
    };
    this.modalService.open(modal, { size: 'lg', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
