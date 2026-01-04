import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    .btn-logout {
      padding: 0.75rem 2rem;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-logout:hover {
      background-color: #da190b;
    }
  `]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
