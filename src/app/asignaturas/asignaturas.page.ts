import { Component } from '@angular/core';

@Component({
  selector: 'app-asignaturas',
  templateUrl: 'asignaturas.page.html',
  styleUrls: ['asignaturas.page.scss'],
})
export class AsignaturasPage {
  asignaturas: any[] = [];
  noAsistencias: boolean = true;

  constructor() {
    this.loadAsistencias();
  }

  loadAsistencias() {
    const storedAsistencias = localStorage.getItem('asistencias');
    if (storedAsistencias) {
      this.asignaturas = JSON.parse(storedAsistencias);
      this.noAsistencias = this.asignaturas.every(asignatura => asignatura.asistencia === 0);

      // Calcular porcentaje de asistencia
      this.asignaturas.forEach(asignatura => {
        const totalClases = asignatura.totalClases || 0; // Asegurarse de que existe totalClases
        const asistencia = asignatura.asistencia || 0; // Asegurarse de que existe asistencia
        asignatura.porcentaje = totalClases > 0 ? (asistencia / totalClases) * 100 : 0; // Calculo del porcentaje
      });
    } else {
      this.noAsistencias = true; // No hay asistencias
    }
  }

  calcularPorcentaje(asistencia: number, totalClases: number): number {
    return totalClases > 0 ? Math.round((asistencia / totalClases) * 100) : 0;
  }
}
