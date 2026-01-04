import { Routes } from '@angular/router';
import { LoginComponent } from './login/loginComponent.component';
import { TareasComponent } from './tareasMain/tareas.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'tareas', 
    component: TareasComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
