import { AuthService } from './../src/pages/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private aut: AuthService,private ruta :Router){
}
  canActivate() {
    if(this.aut.estaAutenticado()){
     return true;
    }else{
    return this.ruta.navigateByUrl('empleado');
    }
  }

}
