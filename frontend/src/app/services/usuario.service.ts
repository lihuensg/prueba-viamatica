import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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

  cargarMasivamente(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.AppUrl}${this.APIUrl}/carga-masiva`, formData, { headers });
  }
}
