import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetApiService } from '../../services/get-api.service';
import { Department, Member } from '../../models/department';
import { Employee } from '../../models/employee';

declare var bootstrap: any;

@Component({
  selector: 'app-member-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './member-modal.component.html',
  styleUrl: './member-modal.component.scss'
})
export class MemberModalComponent implements OnInit, OnChanges {
  //Input del departamento seleccionado y Output de actualización de miembros
  @Input() department: Department | null = null;
  @Output() departmentUpdated = new EventEmitter<void>();
  
  //Variables 
  memberForm: FormGroup;
  availableEmployees: Employee[] = [];
  departmentMembers: Employee[] = [];
  submitted = false;
  alertMessage = '';
  alertClass = '';
  alertIcon = '';

  //Constructor del formulario y servicio de API
  constructor(
    private formBuilder: FormBuilder,
    private apiService: GetApiService
  ) {
    this.memberForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      superiorId: ['']
    });
  }

  //Inicializar vista
  ngOnInit() {
    if (this.department?._id) {
      this.loadEmployees();
    }
  }

  //Cambios en el departamento
  ngOnChanges(changes: SimpleChanges) {
    if (changes['department'] && changes['department'].currentValue) {
      this.loadEmployees();
    }
  }

  //Cargar empleados
  private loadEmployees() {
    if (!this.department?._id) return;

    // Cargar empleados disponibles (no en el departamento)
    this.apiService.getAvailableEmployees(this.department._id).subscribe(
      (employees) => {
        this.availableEmployees = employees;
      }
    );

    // Cargar miembros actuales del departamento (para selección de superior)
    this.apiService.getDepartmentMembers(this.department._id).subscribe(
      (members) => {
        this.departmentMembers = members;
      }
    );
  }

  //Obtener los controles del formulario
  get f() {
    return this.memberForm.controls;
  }

  //Resetear el formulario
  resetForm() {
    this.memberForm.reset();
    this.submitted = false;
    this.alertMessage = '';
  }

  //Cerrar el modal
  private closeModal() {
    const modalElement = document.getElementById('memberAdd');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  //Al enviar formulario se añade un miembro al departamento
  onSubmit() {
    this.submitted = true;

    if (this.memberForm.invalid || !this.department?._id) {
      return;
    }

    const newMember: Member = {
      employeeId: this.f['employeeId'].value,
      subordinateIds: [],
      ...(this.f['superiorId'].value && { superiorId: this.f['superiorId'].value })
    };

    this.apiService.addMemberToDepartment(this.department._id, newMember).subscribe({
      next: (response) => {
        this.showAlert('¡Miembro añadido exitosamente!', 'alert-success', 'bi bi-check-circle-fill');
        setTimeout(() => {
          this.departmentUpdated.emit();
          this.closeModal();
          this.resetForm();
          window.dispatchEvent(new Event('departmentUpdated'));
        }, 2000);
      },
      error: (error) => {
        this.showAlert(
          error.error?.message || 'Error al añadir el miembro',
          'alert-danger',
          'bi bi-exclamation-octagon-fill'
        );
      }
    });
  }

  //Complementario de las alertas
  private showAlert(message: string, alertClass: string, icon: string) {
    this.alertMessage = message;
    this.alertClass = `alert ${alertClass} d-flex align-items-center`;
    this.alertIcon = icon;
  }
}