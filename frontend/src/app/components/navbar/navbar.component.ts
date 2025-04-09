import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAdminUser: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdminUser = this.authService.isAdmin();                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  }

  cerrarSesion() {
    this.authService.logoutBackend(); // ahora llama también al backend
  }
}
