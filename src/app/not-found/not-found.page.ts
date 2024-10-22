import { Component } from '@angular/core';
import { Location } from '@angular/common'; // Importar Location

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage {

  constructor(private location: Location) {} // Inyectar Location

  volverAtras() {
    this.location.back(); // Volver a la página anterior
  }
}
