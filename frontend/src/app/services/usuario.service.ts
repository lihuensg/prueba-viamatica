import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Persona } from '../interfaces/persona';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 private AppUrl: string;
   private APIUrl: string; 
 
   constructor(private http: HttpClient, private router: Router) {
     this.AppUrl = environment.endpoint;
     this.APIUrl = 'usuario';
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

  cargarMasivamente(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.AppUrl}${this.APIUrl}/carga-masiva`, formData, { headers });
  }

  getIdUsuario(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.idUsuario || null;
  }
  
  getTodasLasPersonas(): Observable<Persona[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Persona[]>(`${this.AppUrl}${this.APIUrl}/personas`, { headers });
  }
  
  actualizarPersona(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.AppUrl}${this.APIUrl}/persona/${id}`, data, { headers });
  }
}
