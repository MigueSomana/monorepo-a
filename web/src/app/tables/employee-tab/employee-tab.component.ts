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
  }

  //Actualizar empleados
  onEmployeeUpdated() {
    this.loadEmployees();
  }

  //Cargar empleados
  loadEmployees() {
    this.employeeService.getEmployees().subscribe((result: any) => {
      this.employees = result.data;
    });
  }

  //Abrir modal para crear empleado
  openCreateModal() {
    this.isEditMode = false;
    this.selectedEmployee = null;
  }

  //Abrir modal para editar empleado
  openEditModal(employee: Employee) {
    console.log(employee);
    this.isEditMode = true;
    this.selectedEmployee = employee;
  }

  //Formatear fecha
  formatDate(a: any): string {
    const dateString = String(a); 
    return dateString.split('T')[0]; 
  }

  //Seleccionar empleado para vista
  openView(employee: Employee){
    this.employeeView=employee;
  }
  
}
