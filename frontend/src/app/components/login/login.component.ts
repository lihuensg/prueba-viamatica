import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    userName: string = ''
    mail: string = ''
    password: string = ''
    mostrarReset = false;
    email = '';
    nuevaContrasena = '';
    mensaje = '';
    token = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

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

  solicitarReset() {
    this.authService.solicitarResetPassword(this.email).subscribe({
      next: () => this.mensaje = 'Revisa tu correo para restablecer tu contraseña',
      error: err => {
        console.error(err);
        this.mensaje = 'Error al enviar solicitud';
      }
    });
  }

  enviarNuevaContrasena() {
    if (!this.token) {
      this.mensaje = 'Token inválido o ausente';
      return;
    }
  
    this.authService.resetearPassword(this.token, this.nuevaContrasena).subscribe({
      next: () => {
        // Redirige al login con el query param ?reset=ok
        this.router.navigate(['/login'], { queryParams: { reset: 'ok' } });
      },  
      error: err => {
        console.error(err);
        this.mensaje = err.error?.error || 'Error al restablecer contraseña';
      }
    });
  }
  
}
