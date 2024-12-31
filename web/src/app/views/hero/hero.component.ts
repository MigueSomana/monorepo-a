import { Component } from '@angular/core';
import { CommonModule } from '@angular/common' 
import { EmployeeTabComponent } from '../../tables/employee-tab/employee-tab.component';
import { DepartmentTabComponent } from '../../tables/department-tab/department-tab.component';
import { InstrucComponent } from '../instruc/instruc.component';

@Component({
  selector: 'app-hero',
  imports: [CommonModule,EmployeeTabComponent,DepartmentTabComponent,InstrucComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  //Variables
  activeSection: 'empleados' | 'departamentos' | null = null;

  //Funcion para cambiar de seccion
  toggleSection(section: 'empleados' | 'departamentos') {
    this.activeSection = this.activeSection === section ? null : section;
  }
}