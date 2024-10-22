import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;
  showMessage: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  passwordVisible: boolean = false; // Estado para mostrar/ocultar la contraseña
  confirmPasswordVisible: boolean = false; // Estado para mostrar/ocultar la confirmación de contraseña

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.resetPasswordForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      this.showMessage = false;
      return;
    }

    const { username, newPassword, confirmPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.showMessage = false;
      return;
    }

    const success = this.authService.resetPassword(username, newPassword);
    
    if (success) {
      this.successMessage = 'Contraseña restablecida con éxito.';
    } else {
      this.errorMessage = 'No se pudo restablecer la contraseña. Verifica tu nombre de usuario.';
    }

    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.router.navigate(['/login']);
    }, 3000);
  }
}
