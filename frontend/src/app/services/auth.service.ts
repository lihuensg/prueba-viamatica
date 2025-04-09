import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AppUrl: string;
  private APIUrl: string; 

  constructor(private http: HttpClient, private router: Router) {
    this.AppUrl = environment.endpoint;
    this.APIUrl = 'session';
  }

  login(usuario: Usuario): Observable<string> {
    return this.http.post<string>(`${this.AppUrl}${this.APIUrl}/login`, usuario);
  }

  getRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];
  
    const decoded: any = jwtDecode(token); 
    return decoded.rol || [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('admin');
  }

  logoutBackend(): void {
    const token = localStorage.getItem('token');

    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(`${this.AppUrl}${this.APIUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        console.log('Sesión cerrada en backend');
      },
      error: err => {
        console.error('Error cerrando sesión:', err);
      },
      complete: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  obtenerResumenBienvenida(): Observable<any>  {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.AppUrl}${this.APIUrl}/resumen`, { headers });
  }

  obtenerResumen(): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.AppUrl}${this.APIUrl}/resumenDashboard`, { headers });
  }
} 
