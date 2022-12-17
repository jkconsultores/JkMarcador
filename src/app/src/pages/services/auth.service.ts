import Swal from 'sweetalert2';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
   //localhost='https://jk-smart.com:82/';
   localhost='https://localhost:7195/';

  loginUrl = this.localhost+'api/Usuario/login';
  AsistenciaUrl = this.localhost+'api/Asistencia';
  archivo = this.localhost+'api/Empleado/file';
  empleadoUrl=this.localhost+'api/Empleado/info';
  constructor(private http: HttpClient) {
  }

  login(form: object) {
    return this.http.post(this.loginUrl, form);
  }

  entrada(tipo: string, cod_empleado: Number, identificador: string, uri: any,ip_public:string) {
    var token=localStorage.getItem('token');
    return this.http.post(this.AsistenciaUrl, this.marcar(tipo, cod_empleado, identificador, uri,ip_public),{
      headers: {'token':token}
    });
  }

  marcar(tipo: string, cod_empleado: Number, identificador: string, uri: any,ip_public:string) {
    var uri:any=this.parseData(uri);
    uri=uri[0][1];
    var pos = uri.search(",");
    var res = uri.substr(pos + 1);
    const val = {
      // "fecha": fecha,
      "tipo": tipo,
      "cod_empleado": cod_empleado,
      "identificador": identificador,
      "imagen": res,
      "ip_public":ip_public
    }
    return val;
  }

  obtenerAsistencia() {
    var token=localStorage.getItem('token');
    return this.http.get(this.AsistenciaUrl,{
      headers: {'token':token}
    });
  }
  getEmpleado(codigo:string){
    var token=localStorage.getItem('token');
    return this.http.get(this.empleadoUrl+'?codigo='+codigo,{
      headers: {'token':token}
    });
  }
  parseData(data: string | ArrayBuffer | null){
    var dummyArr: string[][] = []
    var eachLine = data?.toString().split('\n');
    eachLine?.forEach((line: string) => {
      let arr = []
      let str = ""
      for(var i = 0; i < line.length; i++){
        if(line[i] == ';'){
          arr.push(str)
          str = ""
        }else{
          str += line[i]
        }
      }
      arr.push(str)
      dummyArr.push(arr)
    })
    return dummyArr;
  }

estaAutenticado():boolean{
  if(localStorage.getItem('access')){
    return true;
  }else{
    return false;
  }
}
getListaEmpleados(){
 var token=localStorage.getItem('token');
 return this.http.get(this.localhost+'api/Empleado',{
  headers: {'token':token}
    });
}
updateEmpleado(form:EmpleadoModel){
  var token=localStorage.getItem('token');
  return this.http.post(this.localhost+'api/Empleado/update',form,{
    headers: {'token':token}
    });
}
insertEmpleado(form:EmpleadoModel){
  var token=localStorage.getItem('token');
  return this.http.post(this.localhost+'api/Empleado/insert',form,{
    headers: {'token':token}
    });
}
getLocales(){
  var token=localStorage.getItem('token');
  return this.http.get(this.localhost+'local',{
    headers: {'token':token}
    });
}
updateAsistencia(form:any){
  form.tipo='MANUAL';
  var token=localStorage.getItem('token');
  return this.http.post(this.localhost+'api/Asistencia/update',form,{
    headers: {'token':token}
    });
}
crearAsistencia(form:any){
  var token=localStorage.getItem('token');
  form.tipo='MANUAL';
  return this.http.post(this.localhost+'api/Asistencia/insert',form,{
    headers: {'token':token}
    });
}
buscarIp(){
  return this.http.get('https://api.ipify.org/?format=json');
}

cargando(){
  Swal.fire({
    title: 'Cargando...',
    focusCancel:false,
    allowOutsideClick: false
  });
  Swal.showLoading();
}

getAsistenciaPorMes(mes:any,año:any){
var token=localStorage.getItem('token');
return this.http.get(this.localhost+'api/Asistencia/mes?mes='+mes+'&year='+año,{
  headers: {'token':token}
    });
}

getAsistenciaEmpleado(desde:string,hasta:string,empleado:string){
  var token=localStorage.getItem('token');
  return this.http.get(this.localhost+"api/Asistencia/empleado?desde="+desde+"&hasta="+hasta+"&empleado="+empleado,{
    headers: {'token':token}
    });
}
rangoAsistencia(desde:string,hasta:string){
  var token=localStorage.getItem('token');
  return this.http.get(this.localhost+"api/Asistencia/rangoAsistencia?desde="+desde+"&hasta="+hasta,{
    headers: {'token':token}
    });
}

}
