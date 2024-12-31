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
  }

  //Actualizar departamentos
  onDepartmentUpdated() {
    this.loadDepartments();
  }

  //Cargar departamentos
  loadDepartments() {
    this.departmentService.getDepartments().subscribe((result: any) => {
      this.departments = result.data;
    });
  }

  //Abrir modal para crear departamento
  openCreateModal() {
    this.isEditMode = false;
    this.selectedDepartment = null;
  }

  //Abrir modal para editar departamento
  openEditModal(department: Department) {
    console.log(department);
    this.isEditMode = true;
    this.selectedDepartment = department;
  }

  //Eliminar departamento
  deleteDep() {
    this.departmentService
      .deleteDepartment(this.selectedDepartment?._id || '')
      .subscribe((result: any) => {
        this.loadDepartments();
      });
      setTimeout(() => {
        this.closeModal();
      }, 1000);
  }

  //Seleccionar departamento para su CRUD
  selectDepartment(department: Department) {
    this.selectedDepartment = department;
  }

  //Cerrar modal
  private closeModal() {
    const modalElement = document.getElementById('deleteDepartment');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

}
