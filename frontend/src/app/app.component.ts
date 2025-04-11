// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public router: Router) {}

  mostrarNavbar(): boolean {
    const urlSinQuery = this.router.url.split('?')[0];
    return !(urlSinQuery.startsWith('/login') || urlSinQuery.startsWith('/reset-password'));
  }
  
}

