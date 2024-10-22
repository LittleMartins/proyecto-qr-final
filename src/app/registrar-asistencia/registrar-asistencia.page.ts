import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/database.service';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.page.html',
  styleUrls: ['./registrar-asistencia.page.scss'],
})
export class RegistrarAsistenciaPage implements OnInit {
  asignaturas: any[] = [];
  alumnos: any[] = [];
  asignaturaSeleccionada: any;
  fecha: string = '';
  hora: string = ''; // Nueva propiedad para la hora
  asistencias: any[] = [];
  estados = ['Presente', 'Ausente', 'Justificado'];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.fecha = this.obtenerFechaActual();
    this.hora = this.obtenerHoraActual(); // Inicializa la hora
    this.cargarAsignaturas();
    this.cargarHistorialAsistencias(); // Cargar historial al iniciar
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  obtenerHoraActual(): string {
    const hoy = new Date();
    const horas = String(hoy.getHours()).padStart(2, '0');
    const minutos = String(hoy.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`; // Retorna la hora en formato HH:MM
  }

  cargarAsignaturas() {
    this.asignaturas = [
      { nombre: 'ESTADISTICA DESCRIPTIVA_005D' },
      { nombre: 'INGLES INTERMEDIO_018D' },
      { nombre: 'PROGRAMACION DE APLICACIONES MOVILES_003D' },
      { nombre: 'ARQUITECTURA_002D' },
      { nombre: 'CALIDAD DE SOFTWARE_002D' },
      { nombre: 'ETICA PARA EL TRABAJO_006D' },
      { nombre: 'PROCESO DE PORTAFOLIO 4_004D' }
    ];
  }

  seleccionarAsignatura(asignatura: any) {
    this.asignaturaSeleccionada = asignatura;
    this.cargarAsistencia(asignatura.nombre);
  }

  registrarAsistencia() {
    if (!this.asignaturaSeleccionada) {
      return alert('Por favor, selecciona una asignatura.');
    }

    const fechaActual = this.fecha || this.obtenerFechaActual();
    const horaActual = this.hora || this.obtenerHoraActual(); // Usa la hora actual
    const asistenciaId = this.generarIdUnico();

    const alumnosConEstado = this.alumnos.map(alumno => ({
      ...alumno,
      estado: alumno.estado || 'Presente'
    }));

    const todosConEstadoValido = alumnosConEstado.every(alumno => 
      this.estados.includes(alumno.estado)
    );

    if (!todosConEstadoValido) {
      return alert('Todos los alumnos deben tener un estado válido antes de registrar la asistencia.');
    }

    const asistenciaData = {
      id: asistenciaId,
      asignatura: this.asignaturaSeleccionada.nombre,
      fecha: fechaActual,
      hora: horaActual, // Agrega la hora al objeto de asistencia
      alumnos: alumnosConEstado
    };

    this.storageService.createObject(`asistencia-${asistenciaId}`, asistenciaData);
    this.asistencias.push(asistenciaData);
    alert(`Asistencia registrada para ${this.asignaturaSeleccionada.nombre} en la fecha: ${fechaActual} a las ${horaActual}`);
  }

  generarIdUnico(): number {
    return Date.now();
  }

  cargarAsistencia(asignaturaNombre: string) {
    const fechaActual = this.fecha || this.obtenerFechaActual();
    const allAsistencias = Object.keys(localStorage).filter(key => key.startsWith('asistencia-'));
    
    const asistenciasFiltradas = allAsistencias
      .map(key => this.storageService.getObjectById(key))
      .filter(asistencia => asistencia.asignatura === asignaturaNombre && asistencia.fecha === fechaActual);

    this.asistencias = asistenciasFiltradas;
    this.alumnos = asistenciasFiltradas.length > 0 ? asistenciasFiltradas[0].alumnos : this.cargarAlumnosPorDefecto();
  }

  cargarAlumnosPorDefecto() {
    return [
      { id: 1, nombre: 'Martín Almonacid', estado: 'Presente' },
      { id: 2, nombre: 'Diego Mesias', estado: 'Presente' },
      { id: 3, nombre: 'Diego Robert', estado: 'Presente' }
    ];
  }

  eliminarAsistencia(id: number) {
    this.storageService.deleteObject(`asistencia-${id}`);
    this.cargarHistorialAsistencias();
    alert(`Asistencia eliminada con ID: ${id}`);
  }

  editarAsistencia(asistencia: any) {
    this.storageService.updateObject(`asistencia-${asistencia.id}`, asistencia);
    this.cargarHistorialAsistencias();
    alert(`Asistencia con ID: ${asistencia.id} actualizada`);
  }

  cargarHistorialAsistencias() {
    const allAsistencias = Object.keys(localStorage).filter(key => key.startsWith('asistencia-'));
    this.asistencias = allAsistencias
      .map(key => this.storageService.getObjectById(key))
      .filter(asistencia => asistencia.fecha === this.fecha);
  }
}
