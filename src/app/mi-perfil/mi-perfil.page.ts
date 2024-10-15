import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  profileImage: string | ArrayBuffer | null = null;
  nombre: string = '';
  correo: string = '';
  telefono: string = '';

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el nombre, el correo y el teléfono del localStorage
    this.nombre = localStorage.getItem('username') || '';
    this.correo = localStorage.getItem('correo') || '';
    this.telefono = localStorage.getItem('telefono') || ''; // Recuperar el teléfono
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.profileImage = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'circles',  
    });

    await loading.present();

    // Simula el tiempo de guardado
    setTimeout(async () => {
      // Guardar el número de teléfono en localStorage
      localStorage.setItem('telefono', this.telefono); 

      console.log("Perfil guardado");
      console.log("Nombre:", this.nombre);
      console.log("Correo:", this.correo);
      console.log("Teléfono:", this.telefono);
      console.log("Imagen de perfil:", this.profileImage);

      const toast = await this.toastController.create({
        message: 'Perfil cambiado correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });

      await toast.present();
      await loading.dismiss();
    }, 2000); 
  }

  goHome() {
    this.router.navigate(['/home']);  
  }
}
