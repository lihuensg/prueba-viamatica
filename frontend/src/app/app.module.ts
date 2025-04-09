import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    BienvenidaComponent,
    MantenimientoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,      
    HttpClientModule,
    RouterModule,
    AppRoutingModule    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
