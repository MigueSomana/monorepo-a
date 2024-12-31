import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { GetApiService } from '../../services/get-api.service';
import { Department } from '../../models/department';

declare var bootstrap: any;

@Component({
  selector: 'app-department-modal',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './department-modal.component.html',
  styleUrl: './department-modal.component.scss',
})
export class DepartmentModalComponent implements OnInit, OnChanges {
  //Inpust y Outputs
  @Input() isEditMode = false;
  @Input() selectedDepartment: Department | null = null;
  @Output() departmentUpdated = new EventEmitter<void>();

  //Variables
  departmentForm: FormGroup;
  submitted = false;
  alertMessage = '';
  alertClass = '';
  alertIcon = '';

  //Constructor de formulario y servicio
  constructor(
    private formBuilder: FormBuilder,
    private departmentService: GetApiService
  ) {
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  //Al iniciar resetear formulario
  ngOnInit() {
    this.resetForm();
    if (this.selectedDepartment) {
      this.loadDepartmentData();
    }
  }

  //Actualizar cambios constantemente
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDepartment']) {
      this.resetForm();
      if (changes['selectedDepartment'].currentValue) {
        this.loadDepartmentData();
      }
    }
  }

  //Cargar los datos de los departamentos
  private loadDepartmentData() {
    if (this.selectedDepartment) {
      this.departmentForm.patchValue({
        name: this.selectedDepartment.name,
        description: this.selectedDepartment.description,
      });
    }
  }

  //Obtener los controles del formulario
  get f() {
    return this.departmentForm.controls;
  }

  //Resetear formulario
  resetForm() {
    this.departmentForm.reset();
    this.submitted = false;
    this.alertMessage = '';
  }

  //Cerrar modal
  private closeModal() {
    const modalElement = document.getElementById('departmentCreate');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  //Al enviar el formulario y dependiendo del modo, se actualiza o se crea un nuevo departamento
  onSubmit() {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedDepartment?._id) {
      const updateData: Partial<Department> = {
        name: this.f['name'].value,
        description: this.f['description'].value,
        members: this.selectedDepartment.members
      };
      //Actualizar el departamento existente
      this.departmentService
        .updateDepartment(this.selectedDepartment._id, updateData)
        .subscribe({
          next: (response) => {
            console.log('Departamento actualizado:', response);
            this.showAlert(
              '¡Departamento actualizado exitosamente!',
              'alert-success',
              'bi bi-check-circle-fill'
            );
            setTimeout(() => {
              this.departmentUpdated.emit();
              this.closeModal();
              this.resetForm();
            }, 2000);
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            this.showAlert(
              error.error?.message || 'Error al actualizar el departamento',
              'alert-danger',
              'bi bi-exclamation-octagon-fill'
            );
          },
        });
    } else {
      //Crear nuevo departamento
      const newDepartment: Omit<Department, '_id'> = {
        name: this.f['name'].value,
        description: this.f['description'].value,
        members: []
      };

      this.departmentService.createDepartment(newDepartment).subscribe({
        next: (response) => {
          console.log('Departamento creado:', response);
          this.showAlert(
            '¡Departamento creado exitosamente!',
            'alert-success',
            'bi bi-check-circle-fill'
          );
          setTimeout(() => {
            this.departmentUpdated.emit();
            this.closeModal();
            this.resetForm();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.showAlert(
            error.error?.message || 'Error al crear el departamento',
            'alert-danger',
            'bi bi-exclamation-octagon-fill'
          );
        },
      });
    }
  }

  //Complementario de las alertas
  private showAlert(message: string, alertClass: string, icon: string) {
    this.alertMessage = message;
    this.alertClass = `alert ${alertClass} d-flex align-items-center`;
    this.alertIcon = icon;
    console.log('Alert shown:', { message, alertClass, icon });
  }
}
