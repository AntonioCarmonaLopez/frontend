import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareasService } from './tareas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarea } from '../models/interfaces'
import { lastValueFrom } from 'rxjs';
import { HomeComponent } from '../components/home/home.component'

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HomeComponent], 
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})


export class TareasComponent implements OnInit {
  tareas: any;
  displayStyle = 'none';
  titulo = '';
  subTitulo = '';
  form!: FormGroup;
  tareaVacia: any;
  modoEdicion = false;
  constructor(private tareasService: TareasService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: (null),
      titulo: [{ value: '', disabled: this.modoEdicion }, [Validators.required]],
      descripcion: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      estado: ['', Validators.required]
    });

    this.getTareas();
  }

  async getTareas() {
    try {
      this.tareas = await lastValueFrom(this.tareasService.getTareas());
      console.log('Tareas actuales:', this.tareas);
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error al cargar tareas', e);
    }
  }

  openPopup(accion: string, tarea: any) {
    this.displayStyle = "block";
    this.titulo = accion;
    switch (this.titulo) {
      case 'Editar':
        this.subTitulo = 'Editar tarea';
        this.modoEdicion = true;
        this.form.get('titulo')?.disable();
        tarea = {
          ...tarea,
          fechaCreacion: tarea.fechaCreacion ? this.formatearFecha(tarea.fechaCreacion) : ''
        };
        this.form.patchValue(tarea);
        break;
      default:
        this.subTitulo = 'Insertar tarea';
        this.modoEdicion = false;
        this.form.get('titulo')?.enable();
    }
  }

  private formatearFecha(fecha: Date | string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async guardarTarea(accion: string) {
    if (this.form.invalid) {
      console.error('Formulario inválido');
      return;
    }
    
    const fechaCreacionValue = this.form.get('fechaCreacion')?.value;
    const fechaCreacion = fechaCreacionValue ? new Date(fechaCreacionValue) : new Date();
    
    let tarea: Tarea;

    tarea = {
      id: this.form.get('id')?.value,
      titulo: this.form.get('titulo')?.value || '',
      descripcion: this.form.get('descripcion')?.value || '',
      estado: this.form.get('estado')?.value || '',
      fechaCreacion: fechaCreacion
    };

    console.log('Enviando tarea:', tarea);
    console.log('Fecha como objeto:', tarea.fechaCreacion);
    console.log('Fecha como ISO:', tarea.fechaCreacion.toISOString());

    try {
      const result = await lastValueFrom(this.tareasService.crearTarea(tarea));
      console.log('Tarea guardada exitosamente:', result);
      await this.getTareas();
      this.closePopup();
      this.form.reset();
    } catch (err: any) {
      console.error('Error al guardar tarea', err);
      console.error('Error status:', err.status);
      console.error('Error response:', err.error);
    }
  }

  closePopup() {
    this.displayStyle = "none";
  }

  async borrarTarea(id: number) {
    try {
      await lastValueFrom(this.tareasService.borrarTarea(id));
      await this.getTareas();
    } catch (e) {
      console.error('Error al borrar tarea', e);
    }
  }
}
