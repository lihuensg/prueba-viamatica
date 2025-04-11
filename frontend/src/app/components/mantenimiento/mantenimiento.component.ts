import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  estadosUsuarios: any[] = [];
  mensajeBusqueda: string = '';
  personasBusqueda: any[] = [];
  nombre: string = '';
  apellido: string = '';  

  mensajeActualizacion: string | null = null;
  mensajeTipo: 'success' | 'error' | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPersonas();
    this.obtenerEstadosUsuarios();
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

  @ViewChild('formularioPersona') formularioPersona!: ElementRef;

  seleccionarPersona(persona: any) {
    this.personaSeleccionada = persona;

    // Limpiar mensaje si se selecciona otra persona
    this.mensajeActualizacion = '';

    // Scroll al formulario
    setTimeout(() => {
      this.formularioPersona?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
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
  
        this.cargarPersonas();  // Recarga la lista
  
        // Ocultar el formulario y resetear la persona seleccionada después de un tiempo
        setTimeout(() => {
          this.mensajeActualizacion = null;
          this.mensajeTipo = null;
          this.personaSeleccionada = null; // 👈 esto oculta el formulario
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar la persona:', err);
        this.mensajeActualizacion = 'Error al actualizar los datos';
        this.mensajeTipo = 'error';
      }
    });
  }
  

   // Método para obtener los estados de los usuarios
   obtenerEstadosUsuarios(): void {
    this.usuarioService.obtenerEstadoUsuarios().subscribe({
      next: (data) => {
        console.log('Estados de usuarios:', data);  // Verifica los datos aquí
        this.estadosUsuarios = data;  // Aquí se almacenan los estados de los usuarios
      },
      error: (err) => {
        console.error('Error al obtener estados de los usuarios:', err);
      }
    });
  }

  // Método para actualizar el estado de un usuario
  actualizarEstado(idUsuario: string, estado: string): void {
    this.usuarioService.actualizarEstado(idUsuario, estado).subscribe({
      next: () => {
        this.mensajeActualizacion = 'Estado actualizado correctamente';
        this.mensajeTipo = 'success';
        this.obtenerEstadosUsuarios();  // Recargar los estados de los usuarios
        setTimeout(() => {
          this.mensajeActualizacion = null;
          this.mensajeTipo = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar el estado del usuario:', err);
        this.mensajeActualizacion = 'Error al actualizar el estado';
        this.mensajeTipo = 'error';
      }
    });
  }

  buscarPersonas(): void {
    this.usuarioService.buscarPersonas(this.nombre, this.apellido).subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.personasBusqueda = response;
          this.mensajeBusqueda = '';
        } else {
          this.personasBusqueda = [];
          this.mensajeBusqueda = 'No se encontraron personas.';
        }
      },
      (error) => {
        this.personasBusqueda = [];
        this.mensajeBusqueda = 'Ocurrió un error al buscar personas.';
        console.error('Error al buscar personas:', error);
      }
    );
  }
}