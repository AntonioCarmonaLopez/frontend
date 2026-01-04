import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/interfaces'

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private baseUrl = '/api/tareas';

  private getAll = `${this.baseUrl}/gettareas`;
  private guardarTarea = `${this.baseUrl}/guardartarea`;
  private deleteById = `${this.baseUrl}/borrar`;

  
  constructor(private http: HttpClient) {}

  getTareas(): Observable<any[]> {
    return this.http.get<any[]>(this.getAll);
  }

   crearTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.guardarTarea, tarea);
  }
  borrarTarea(id:number) {
    return this.http.delete(`${this.deleteById}/${id}`);
  }

}
