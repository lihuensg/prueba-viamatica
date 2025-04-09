import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  usuario: any;
  ultimaSesion: any;
  intentosFallidos: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.obtenerResumenBienvenida().subscribe({
      next: (data: any) => {
        this.usuario = data.usuario;
        this.ultimaSesion = data.ultimaSesion;
        this.intentosFallidos = data.intentosFallidos;
      },
      error: (err) => {
        console.error('Error al cargar el resumen:', err);
      }
    });
  }
}
