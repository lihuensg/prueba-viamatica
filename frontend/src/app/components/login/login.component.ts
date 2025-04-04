import { Component } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  usuario: Usuario = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.usuario).subscribe(
      res => console.log('Login exitoso', res),
      err => console.error('Error al iniciar sesión', err)
    );
  }
}
