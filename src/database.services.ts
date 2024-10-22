// database.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbName: string = 'my_database'; // Nombre de la base de datos
  private sqliteConnection: SQLiteConnection; // Conexión a SQLite

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite); // Inicializa la conexión
  }

  // Inicializa la base de datos y crea tablas
  async initializeDatabase() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(
          this.dbName,
          false,            // No encriptado
          'no-encryption',  // Tipo de encriptación
          1,                // Versión de la base de datos
          false             // readonly: false (la base de datos no es de solo lectura)
        );

        await db.open(); // Abre la conexión a la base de datos

        // Crea las tablas necesarias
        await this.createTables(db);

        console.log('Base de datos inicializada correctamente');
      } else {
        console.log('Las conexiones de base de datos no son compatibles en la web.');
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  // Crea las tablas necesarias en la base de datos
  private async createTables(db: SQLiteDBConnection) {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS example_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );`;

    try {
      await db.execute(createTableQuery);
      console.log('Tabla creada o ya existe.');
    } catch (error) {
      console.error('Error al crear la tabla:', error);
    }
  }

  // Inserta datos en la tabla example_table
  async insertData(name: string): Promise<void> {
    const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await db.open();

    const insertQuery = `INSERT INTO example_table (name) VALUES (?);`;
    try {
      await db.run(insertQuery, [name]); // Cambia `execute` a `run`
      console.log('Dato insertado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al insertar dato:', error);
    } finally {
      await db.close(); // Cierra la conexión después de la inserción
    }
  }

  // Método para obtener todos los datos de la tabla example_table
  async getAllData(): Promise<any[]> {
    const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await db.open();

    const selectQuery = `SELECT * FROM example_table;`;
    let result: any[] = [];
    try {
      const res = await db.query(selectQuery);
      result = res.values || []; // Asegúrate de que result sea un array
      console.log('Datos obtenidos correctamente:', result);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      await db.close(); // Cierra la conexión después de la consulta
    }
    return result;
  }

  // Método para eliminar un dato por su ID
  async deleteData(id: number): Promise<void> {
    const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await db.open();

    const deleteQuery = `DELETE FROM example_table WHERE id = ?;`;
    try {
      await db.run(deleteQuery, [id]); // Cambia `execute` a `run`
      console.log(`Dato con ID ${id} eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar dato:', error);
    } finally {
      await db.close(); // Cierra la conexión después de la eliminación
    }
  }

  // Método para actualizar un dato por su ID
  async updateData(id: number, name: string): Promise<void> {
    const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await db.open();

    const updateQuery = `UPDATE example_table SET name = ? WHERE id = ?;`;
    try {
      await db.run(updateQuery, [name, id]); // Cambia `execute` a `run`
      console.log(`Dato con ID ${id} actualizado correctamente.`);
    } catch (error) {
      console.error('Error al actualizar dato:', error);
    } finally {
      await db.close(); // Cierra la conexión después de la actualización
    }
  }
}
