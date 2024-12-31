import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee';
import { GetApiService } from '../../services/get-api.service';
import { EmployeeModalComponent } from '../../modals/employee-modal/employee-modal.component';

@Component({
  selector: 'app-employee-tab',
  imports: [CommonModule,EmployeeModalComponent],
  templateUrl: './employee-tab.component.html',
  styleUrl: './employee-tab.component.scss',
})
export class EmployeeTabComponent implements OnInit {
  //Variables
  employees: Employee[] = [];
  isEditMode = false;
  selectedEmployee: Employee | null = null;
  employeeView: Employee | null = null;

  //Constructor del servicio
  constructor(private employeeService: GetApiService) {}

  //Al iniciar cargar empleados
  ngOnInit() {
    this.loadEmployees();
    this.setupModalListeners();
  }

  //Resetear variables del componente
  private setupModalListeners() {
    const modalElement = document.getElementById('empleadoCreate');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetModalState();
      });
    }
  }

  //Resetear las variables
  private resetModalState() {
    this.isEditMode = false;
    this.selectedEmployee = null;
  }

  //Actualizar empleados y modal
  onEmployeeUpdated() {
    this.loadEmployees();
    this.resetModalState();
  }

  //Cargar a los empleados desde el servicio
  loadEmployees() {
    this.employeeService.getEmployees().subscribe((result: any) => {
      this.employees = result.data;
    });
  }

  //Abrir modal de crear
  openCreateModal() {
    this.resetModalState();
  }

  //Abrir modal de editar
  openEditModal(employee: Employee) {
    this.resetModalState(); // Limpiamos el estado anterior primero
    setTimeout(() => {
      this.isEditMode = true;
      this.selectedEmployee = employee;
    }, 0);
  }

  //Formatear fecha
  formatDate(a: any): string {
    const dateString = String(a);
    return dateString.split('T')[0];
  }

  //Abrir vista
  openView(employee: Employee) {
    this.employeeView = employee;
  }
}