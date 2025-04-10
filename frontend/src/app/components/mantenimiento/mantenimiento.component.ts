import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent {
  archivo: File | null = null;
  resultado: any = null;

  constructor(private usuarioService: UsuarioService) {}

  onArchivoSeleccionado(event: any) {
    this.archivo = event.target.files[0];
  }

  subirArchivo() {
    if (!this.archivo) return;

    this.usuarioService.cargarMasivamente(this.archivo).subscribe({
      next: (res) => {
        this.resultado = res;
      },
      error: (err) => {
        console.error('Error al subir el archivo', err);
      }
    });
  }

  get esAdmin(): boolean {
    return this.usuarioService.isAdmin();
  }
}
