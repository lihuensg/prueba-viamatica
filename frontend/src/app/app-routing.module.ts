import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecuperarComponent } from './auth/recuperar/recuperar.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListadoComponent } from './usuarios/listado/listado.component';
import { DetalleComponent } from './usuarios/detalle/detalle.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolGuard } from './shared/guards/rol.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Página inicial
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'bienvenida', component: BienvenidaComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, RolGuard], data: { role: 'admin' } },
  { path: 'usuarios', component: ListadoComponent, canActivate: [AuthGuard, RolGuard], data: { role: 'admin' } },
  { path: 'usuarios/detalle/:id', component: DetalleComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' } // Si la ruta no existe, redirige al login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
