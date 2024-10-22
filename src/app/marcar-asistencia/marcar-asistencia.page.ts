import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/database.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-marcar-asistencia',
  templateUrl: './marcar-asistencia.page.html',
  styleUrls: ['./marcar-asistencia.page.scss'],
})
export class MarcarAsistenciaPage implements OnInit {
  asignatura: string | null = null;
  fecha: string = '';
  horaActual: string = '';
  nombreUsuario: string = 'Martín Almonacid';
  correoUsuario: string = 'martin.almonacid@duocuc.cl';
  hasDevices: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined = undefined; 
  isCameraActive: boolean = false; // Nuevo estado para la cámara

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.fecha = this.obtenerFechaActual();
    this.horaActual = this.obtenerHoraActual();
    this.checkDeviceAndPermission();
    setInterval(() => {
      this.horaActual = this.obtenerHoraActual();
    }, 1000);
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  obtenerHoraActual(): string {
    const ahora = new Date();
    return ahora.toLocaleTimeString();
  }

  async checkDeviceAndPermission() {
    this.hasDevices = true; // Cambia esto según tu lógica de dispositivos
    this.hasPermission = true; // Cambia esto según tu lógica de permisos
  }

  handleScanSuccess(result: string) {
    this.asignatura = result; 
    this.presentToast(`Código escaneado: ${result}`);
  }

  async marcarAsistencia() {
    if (!this.asignatura) {
      await this.presentToast('No se ha escaneado ninguna asignatura.');
      return;
    }

    const asistenciaData = this.crearAsistenciaData();
    const loading = await this.loadingController.create({ message: 'Marcando asistencia...' });
    await loading.present();

    try {
      await this.storageService.createObject(`asistencia-${Date.now()}`, asistenciaData);
      this.actualizarAsistenciasEnLocalStorage(asistenciaData);
      await this.presentToast(`Asistencia marcada para ${this.asignatura} en la fecha: ${this.fecha}`);
      this.resetEstado();
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      await this.presentToast('Hubo un error al marcar la asistencia. Por favor, inténtalo de nuevo.');
    } finally {
      loading.dismiss();
    }
  }

  async marcarAsistenciaPrueba() {
    const asignaturaPrueba = 'PROGRAMACION DE APLICACIONES MOVILES_003D';
    this.asignatura = asignaturaPrueba;

    const asistenciaData = this.crearAsistenciaData();
    const loading = await this.loadingController.create({ message: 'Marcando asistencia de prueba...' });
    await loading.present();

    try {
      await this.storageService.createObject(`asistencia-${Date.now()}`, asistenciaData);
      this.actualizarAsistenciasEnLocalStorage(asistenciaData);
      await this.presentToast(`Asistencia marcada para ${asignaturaPrueba} en la fecha: ${this.fecha}`);
      this.resetEstado();
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      await this.presentToast('Hubo un error al marcar la asistencia de prueba. Por favor, inténtalo de nuevo.');
    } finally {
      loading.dismiss();
    }
  }

  crearAsistenciaData() {
    return {
      id: Date.now(),
      asignatura: this.asignatura,
      fecha: this.fecha,
      hora: this.horaActual,
      usuario: {
        nombre: this.nombreUsuario,
        correo: this.correoUsuario,
      },
    };
  }

  actualizarAsistenciasEnLocalStorage(asistenciaData: any) {
    const storedAsistencias = localStorage.getItem('asistencias');
    let asistencias = storedAsistencias ? JSON.parse(storedAsistencias) : [];

    const asignaturaExistente = asistencias.find((a: any) => a.nombre === asistenciaData.asignatura);
    if (asignaturaExistente) {
      asignaturaExistente.asistencia += 1;
      asignaturaExistente.totalClases += 1;
    } else {
      asistencias.push({
        nombre: asistenciaData.asignatura,
        asistencia: 1,
        totalClases: 1,
      });
    }

    localStorage.setItem('asistencias', JSON.stringify(asistencias));
  }

  resetEstado() {
    this.asignatura = null;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  // Nuevo método para activar/desactivar la cámara
  toggleCamera() {
    this.isCameraActive = !this.isCameraActive;
    if (this.isCameraActive) {
      this.checkDeviceAndPermission(); // Verificar dispositivos y permisos
    }
  }
}
