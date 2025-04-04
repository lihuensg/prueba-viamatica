import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/login'; 

  constructor(private http: HttpClient) {}

  login(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}
