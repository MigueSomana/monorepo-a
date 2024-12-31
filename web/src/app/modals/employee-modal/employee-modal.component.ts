import { Component, OnInit, Input,OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetApiService } from '../../services/get-api.service';
import { Employee } from '../../models/employee';

declare var bootstrap: any;

@Component({
  selector: 'app-employee-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss'
})
export class EmployeeModalComponent implements OnInit, OnChanges {
  //Inputs y Outputs
  @Input() isEditMode = false;
  @Input() selectedEmployee: Employee | null = null;
  @Output() employeeUpdated = new EventEmitter<void>();

  //Variables
  employeeForm: FormGroup;
  submitted = false;
  alertMessage = '';
  alertClass = '';
  alertIcon = '';

  //Contructor de formulario y de servicio 
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: GetApiService
  ) {
    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  //Al iniciar resetear el form
  ngOnInit() {
    this.resetForm();
    if (this.selectedEmployee) {
      this.loadEmployeeData();
    }
  }

  //Actualizar constantemente
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedEmployee']) {
      this.resetForm();
      if (changes['selectedEmployee'].currentValue) {
        this.loadEmployeeData();
      }
    }
  }

  //Cargar los datos de empleados
  private loadEmployeeData() {
    if (this.selectedEmployee) {
      this.employeeForm.patchValue({
        name: this.selectedEmployee.name,
        email: this.selectedEmployee.email
      });
    }
  }

  //Obtener los controles del formulario
  get f() {
    return this.employeeForm.controls;
  }

  //Resetear formulario
  resetForm() {
    this.employeeForm.reset();
    this.submitted = false;
    this.alertMessage = '';
  }

  //Cerrar el modal
  private closeModal() {
    const modalElement = document.getElementById('empleadoCreate');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  //Al enviar el formulario y dependiendo del modo, se actualiza o se crea un empleado
  onSubmit() {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedEmployee?._id) {
      const updateData: Partial<Employee> = {
        name: this.f['name'].value,
        email: this.f['email'].value
      };
      //Actualizar el empleado existente
      this.employeeService.updateEmployee(this.selectedEmployee._id, updateData).subscribe({
        next: (response) => {
          console.log('Empleado actualizado:', response);
          this.showAlert(
            '¡Empleado actualizado exitosamente!',
            'alert-success',
            'bi bi-check-circle-fill'
          );
          setTimeout(() => {
            this.employeeUpdated.emit();
            this.closeModal();
            this.resetForm();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.showAlert(
            error.error?.message || 'Error al actualizar el empleado',
            'alert-danger',
            'bi bi-exclamation-octagon-fill'
          );
        }
      });
    } else {
      //Crear un nuevo empleado
      const newEmployee: Omit<Employee, '_id'> = {
        name: this.f['name'].value,
        email: this.f['email'].value,
        createdAt: new Date()
      };

      this.employeeService.createEmployee(newEmployee).subscribe({
        next: (response) => {
          console.log('Empleado creado:', response);
          this.showAlert(
            '¡Empleado creado exitosamente!',
            'alert-success',
            'bi bi-check-circle-fill'
          );
          setTimeout(() => {
            this.employeeUpdated.emit();
            this.closeModal();
            this.resetForm();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.showAlert(
            error.error?.message || 'Error al crear el empleado',
            'alert-danger',
            'bi bi-exclamation-octagon-fill'
          );
        }
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