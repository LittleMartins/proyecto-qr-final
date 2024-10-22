import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username!: string;
  displayName!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username']; // Obtener el nombre de usuario desde los parámetros de la URL
      this.displayName = this.getDisplayName(this.username); // Obtener el nombre para mostrar
    });
  }

  // Método para transformar el email en un nombre para mostrar
  private getDisplayName(email: string): string {
    const name = email.split('@')[0]; // Obtener la parte del nombre del email
    return name.charAt(0).toUpperCase() + name.slice(1).replace('.', ' '); // Capitalizar la primera letra y reemplazar el punto con un espacio
  }

  // Método para cerrar sesión
  logout() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.classList.add('fade-out');
      
      setTimeout(() => {
        localStorage.removeItem('username'); // Eliminar el nombre de usuario de localStorage
        localStorage.removeItem('correo'); // Eliminar el correo de localStorage
        this.router.navigate(['/login-alumno']); // Redirigir a la página de inicio de sesión
      }, 500); // Espera a que la animación termine
    }
  }
}
