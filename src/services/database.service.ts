import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  createObject(key: string, data: any): void {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    console.log('Objeto guardado en la Base de datos');
  }

  getObjectById(key: string): any {
    const jsonData = localStorage.getItem(key);
    if (jsonData) {
      return JSON.parse(jsonData);
    }
    console.error('Objeto no encontrado');
    return null;
  }

  // Actualizar un objeto en el localStorage
  updateObject(key: string, updatedData: any): void {
    const jsonData = JSON.stringify(updatedData);
    localStorage.setItem(key, jsonData);
    console.log('Objeto actualizado en la Base de datos');
  }

  // Cambiar una imagen almacenada dentro de un objeto
  changeImage(key: string, newImage: string): void {
    const currentData = this.getObjectById(key);
    if (currentData) {
      currentData.image = newImage; 
      this.updateObject(key, currentData);
      console.log('Imagen actualizada en Base de datos');
    } else {
      console.error('No se pudo actualizar la imagen: objeto no encontrado');
    }
  }

  // Eliminar un objeto del localStorage
  deleteObject(key: string): void {
    localStorage.removeItem(key);
    console.log('Objeto eliminado de Base de datos');
  }

  // Añadir un nuevo usuario al localStorage
  addUser(username: string, password: string): void {
    let users = this.getObjectById('users') || [];
    const newUser = { username, password };
    users.push(newUser);
    this.createObject('users', users);
    console.log('Usuario añadido a la Base de datos');
  }

  // Obtener un usuario por su nombre de usuario
  getUser(username: string): any {
    const users = this.getObjectById('users') || [];
    return users.find((user: any) => user.username === username);
  }

  // Actualizar la contraseña de un usuario
  updateUserPassword(username: string, newPassword: string): void {
    let users = this.getObjectById('users') || [];
    const userIndex = users.findIndex((user: any) => user.username === username);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      this.updateObject('users', users);
      console.log('Contraseña de usuario actualizada');
    } else {
      console.error('Usuario no encontrado');
    }
  }

  // Eliminar un usuario por su nombre de usuario
  deleteUser(username: string): void {
    let users = this.getObjectById('users') || [];
    users = users.filter((user: any) => user.username !== username);
    this.createObject('users', users);
    console.log('Usuario eliminado de la Base de datos');
  }
}
