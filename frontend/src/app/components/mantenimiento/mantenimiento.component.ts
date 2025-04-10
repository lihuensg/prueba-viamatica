import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {
  archivo: File | null = null;
  resultado: any = null;
  personas: any[] = [];
  personaSeleccionada: any = null;

  mensajeActualizacion: string | null = null;
  mensajeTipo: 'success' | 'error' | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }
   // Método para cargar las personas, dependiendo si el usuario es admin o no
   cargarPersonas(): void {
    if (this.esAdmin) {
      this.usuarioService.obtenerPersonasNoAdmin().subscribe({
        next: (data) => {
          this.personas = data;
        },
        error: (err) => {
          console.error('Error al obtener personas no admin:', err);
        }
      });
    } else {
      const idUsuario = this.usuarioService.getIdUsuario();
      if (idUsuario) {
        this.usuarioService.obtenerPersonaPorUsuarioId(idUsuario).subscribe({
          next: (data) => {
            this.personaSeleccionada = data;
          },
          error: (err) => {
            console.error('Error al obtener la persona del usuario:', err);
          }
        });
      }
    }
  }
  

  get esAdmin(): boolean {
    return this.usuarioService.isAdmin();
  }

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

  seleccionarPersona(persona: any) {
    this.personaSeleccionada = { ...persona };
  }

  actualizarPersona() {
    if (!this.personaSeleccionada) return;
  
    console.log('Persona seleccionada antes de actualizar:', this.personaSeleccionada);
  
    const datosActualizados = {
      Nombres: this.personaSeleccionada.Nombres,
      Apellidos: this.personaSeleccionada.Apellidos,
      Identificacion: this.personaSeleccionada.Identificacion,
      FechaNacimiento: this.personaSeleccionada.FechaNacimiento
    };
  
    // Determinar si es admin o no
    const personaId = this.esAdmin ? this.personaSeleccionada.id : this.personaSeleccionada.idPersona;
  
    if (!personaId) {
      console.error('ID de la persona no disponible');
      return;
    }
  
    // Llamar a la API usando el id correcto
    this.usuarioService.actualizarPersona(personaId, datosActualizados).subscribe({
      next: () => {
        this.mensajeActualizacion = 'Datos actualizados correctamente';
        this.mensajeTipo = 'success';
  
        // Volver a cargar la lista de personas
        this.cargarPersonas();  // Esto asegura que la lista de personas se actualice después de la actualización
  
        // Resetear mensajes de actualización después de 3 segundos
        setTimeout(() => {
          this.mensajeActualizacion = null;
          this.mensajeTipo = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar la persona:', err);
        this.mensajeActualizacion = 'Error al actualizar los datos';
        this.mensajeTipo = 'error';
      }
    });
  }
}  