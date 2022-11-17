import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/export-excel.service';
import { FiltrarTablaService } from '../../services/filtrar-tabla.service';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(public aut: AuthService,
    private FiltrarTabla: FiltrarTablaService,
    private excelService: ExcelService) { }

  fecha = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  mesActual: any = new Date().getMonth();
  yearActual: any = new Date().getFullYear();
  reporteMesActual: any;
  reporteDiario:any;
  filtroNombreConsolidado:string='';
  filtroNombreReporte:string='';
  reporte=0;
  pd=0;
  ngOnInit(): void {
    this.obtenerReporteMesActual(this.mesActual);

  }
  reporteMes(): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(this.mesActual) + 1,this.yearActual).subscribe((res: []) => {
      if (res.length == 0) {
        return Swal.fire({ icon: 'warning', text: 'No se encontró registros del mes seleccionado!' })
      }
      Swal.close();
      this.excelService.ExcelConsolidadoDiario(this.FiltrarTabla.reportePorDia(res), 'reporte por dia');
    }, error => {
      Swal.close();
    }
    )
  }
  exportToExcel(): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(this.mesActual) + 1,this.yearActual).subscribe((res: []) => {
      Swal.close();
      if (res.length == 0) {
        if (res.length == 0) {
          return Swal.fire({ icon: 'warning', text: 'No se encontró registros del mes seleccionado!' })
        }}
      else {
       var reporte=this.FiltrarTabla.filtrarHorasEmpleado(res);
        this.excelService.ExcelConsolidadoDiario(reporte, 'consolidado diario');
      }}, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); })
  }
  cambiarPestana(){
    console.log('cambió')
  }
  obtenerReporteMesActual(mes: any): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(mes) + 1,this.yearActual).subscribe((res: []) => {
      Swal.close();
      this.reporteDiario=this.FiltrarTabla.reportePorDia(res);
      this.reporteMesActual = this.FiltrarTabla.filtrarHorasEmpleado(res);
    }, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); })
  }

  reporteMesSelect() {
    this.obtenerReporteMesActual(this.mesActual);
  }
}
