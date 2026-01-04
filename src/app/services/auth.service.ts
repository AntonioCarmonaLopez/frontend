import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json'
    });
    
    const loginUrl = '/api/auth/login';
    console.log('POST request to:', loginUrl);
    
    return this.http.post(loginUrl, 
      { username, password },
      { headers }
    ).pipe(
      tap((response: any) => {
        console.log('Response:', response);
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
