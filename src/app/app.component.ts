import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.services'; // Asegúrate de que esta línea esté aquí

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    try {
      await this.dbService.initializeDatabase(); // Llamada de método ajustada
      console.log('Conexión a la base de datos establecida');
    } catch (error) {
      console.error('Error al establecer la conexión a la base de datos:', error);
    }
  }
}
