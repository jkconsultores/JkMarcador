import { ReportesComponent } from './src/pages/admin/reportes/reportes.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './src/pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoComponent} from './src/pages/empleado/empleado.component';
import { AdminComponent} from './src/pages/admin/admin.component';
import { PageNotFoundComponent} from './src/pages/page-not-found/page-not-found.component';

const APP_ROUTES: Routes = [
  {path:'login',component:LoginComponent},
  {path:'reportes',component:ReportesComponent,canActivate:[AuthGuard]},
  {path:'empleado',component:EmpleadoComponent},
  {path:'admin',component:AdminComponent,canActivate:[AuthGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'empleado'},
  { path: '**', component: PageNotFoundComponent },
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES,{useHash: true});
