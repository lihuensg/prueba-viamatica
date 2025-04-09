import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    userName: string = ''
    mail: string = ''
    password: string = ''

  constructor(private authService: AuthService, private router: Router) {}

  logIn() {
    if (this.mail == '' || this.userName == '' ||  this.password == '') {
      alert('Ingrese todos los campos');
      return;
    }

    //Crear el objeto usuario
    const usuario: Usuario = {
      mail: this.mail,
      userName: this.userName,
      password: this.password
    };

    this.authService.login(usuario).subscribe({
      next: (response: any) => { 
        alert('Login exitoso');
        localStorage.setItem('token', response.token);
        localStorage.setItem('sessionId', response.sessionId);
        this.router.navigate(['/bienvenida']);
      }
      , error: (error) => {
        const mensaje = error?.error?.error || 'Error desconocido';
        alert(mensaje);
        console.log(error);
      }
    });
  }
}
