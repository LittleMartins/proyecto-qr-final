import { Injectable } from '@angular/core';

interface Alumno {
  email: string;
  nombre: string;
  estado: string;
  password: string; // Asegúrate de incluir la contraseña en el modelo
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    // Inicializa con datos de usuario si no están en localStorage
    if (!localStorage.getItem('alumnos')) {
      const alumnos: Alumno[] = [
        { email: 'martin.almonacid@duocuc.cl', nombre: 'Martín Almonacid', estado: 'Presente', password: 'Perro234$1' },
        { email: 'diego.mesias@duocuc.cl', nombre: 'Diego Mesías', estado: 'Presente', password: 'Perro234$1' },
        { email: 'diego.robert@duocuc.cl', nombre: 'Diego Robert', estado: 'Presente', password: 'Perro234$1' },
      ];
      localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }
  }

  // Método para restablecer la contraseña
  resetPassword(username: string, newPassword: string): boolean {
    const alumnos: Alumno[] = JSON.parse(localStorage.getItem('alumnos') || '[]');
    const user = alumnos.find(alumno => alumno.email === username);
    if (user) {
      user.password = newPassword; // Actualiza la contraseña
      localStorage.setItem('alumnos', JSON.stringify(alumnos)); // Guarda los cambios en localStorage
      return true;
    }
    return false; // Usuario no encontrado
  }
}
