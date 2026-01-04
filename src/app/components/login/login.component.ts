import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  // Properties for ngModel binding in template
  username = '';
  password = '';

  errorMessage = '';
  isLoading = false;

async onSubmit() {
  console.log('🟢 onSubmit() ejecutado');
  
  this.isLoading = true;
  this.errorMessage = '';
  console.log('=== INICIO LOGIN ===');
  console.log('Username:', this.username);
  console.log('Password:', this.password ? '***' : 'vacío');

  try {
    console.log('Llamando a authService.login...');
    const response = await lastValueFrom(
      this.authService.login(this.username, this.password)
    );

    console.log('=== RESPUESTA COMPLETA ===', response);
    console.log('Response.token:', response?.token);
    console.log('Tipo de response:', typeof response);
    
    if (response && response.token) {
      console.log('✅ Login exitoso');
      console.log('Token guardado:', this.authService.getToken());
      console.log('Redirigiendo a /tareas');
      await this.router.navigate(['/tareas']);
    } else {
      console.log('⚠️ No hay token en la respuesta');
      this.errorMessage = 'No se recibió token de autenticación';
    }
  } catch (error: any) {
    console.error('=== ERROR EN LOGIN ===', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error completo:', error);
    this.errorMessage = error.error?.message || 'Usuario o contraseña incorrectos';
  } finally {
    this.isLoading = false;
    console.log('=== FIN LOGIN ===');
  }
}
}
