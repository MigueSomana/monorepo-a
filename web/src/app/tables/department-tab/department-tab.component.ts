import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from '../../models/department';
import { GetApiService } from '../../services/get-api.service';
import { DepartmentModalComponent } from '../../modals/department-modal/department-modal.component';
import { MemberModalComponent } from "../../modals/member-modal/member-modal.component";
import { GraficoComponent } from '../../views/grafico/grafico.component';

declare var bootstrap: any;

@Component({
  selector: 'app-department-tab',
  imports: [ CommonModule, DepartmentModalComponent, MemberModalComponent, GraficoComponent],
  templateUrl: './department-tab.component.html',
  styleUrl: './department-tab.component.scss',
})

export class DepartmentTabComponent implements OnInit {
  //Variables
  departments: Department[] = [];
  isEditMode = false;
  selectedDepartment: Department | null = null;

  //Constructor del servicio
  constructor(private departmentService: GetApiService) {}

  //Al iniciar cargar departamentos
  ngOnInit() {
    this.loadDepartments();
    this.setupModalListeners();
  }

  //Configuraci[on del modal]
  private setupModalListeners() {
    const modalElement = document.getElementById('departmentCreate');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetModalState();
      });
    }
  }

  //Resetear valores del modal
  private resetModalState() {
    this.isEditMode = false;
    this.selectedDepartment = null;
  }

  //Al actualizar departamento
  onDepartmentUpdated() {
    this.loadDepartments();
    this.resetModalState();
  }

  //Cargar departamentos
  loadDepartments() {
    this.departmentService.getDepartments().subscribe((result: any) => {
      this.departments = result.data;
    });
  }

  //Abrir modal en modo crear
  openCreateModal() {
    this.resetModalState();
  }

  //Abrir modal en modo editar
  openEditModal(department: Department) {
    this.resetModalState(); // Limpiamos el estado anterior primero
    setTimeout(() => {
      this.isEditMode = true;
      this.selectedDepartment = department;
    }, 0);
  }

  //Eliminar departamento
  deleteDep() {
    this.departmentService
      .deleteDepartment(this.selectedDepartment?._id || '')
      .subscribe((result: any) => {
        this.loadDepartments();
        this.resetModalState();
      });
    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  //Marcar departamento como seleccionado
  selectDepartment(department: Department) {
    this.selectedDepartment = department;
  }

  //Cerrar modal
  private closeModal() {
    const modalElement = document.getElementById('deleteDepartment');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}