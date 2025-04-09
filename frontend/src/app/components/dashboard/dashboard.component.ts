// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  activos: any[] = [];
  inactivos: any[] = [];
  bloqueados: any[] = [];

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.authService.obtenerResumen().subscribe({
      next: (data) => {
        this.activos = data.activos;
        this.inactivos = data.inactivos;
        this.bloqueados = data.bloqueados;
      },
      error: (err) => {
        console.error('Error al obtener datos del dashboard:', err);
      },
    });
  }
}
