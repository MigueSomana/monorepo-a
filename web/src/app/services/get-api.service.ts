import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { Department,Member } from '../models/department';

//Interfaz de respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})

export class GetApiService {
  //URL de la API
  private apiUrl1 = "http://localhost:3000/api/employees";
  private apiUrl2 = "http://localhost:3000/api/departments";

  //Constructor del servicio HTTP
  constructor(private http: HttpClient) {}
  
  //Obtener empleados
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl1);
  }

  //Obtener departamentos
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl2);
  }

  //Crear empleado
  createEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.apiUrl1, employee);
  }

  //Actualizar empleado
  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl1}/${id}`, employee);
  }

  //Crear departamento
  createDepartment(department: Department): Observable<any> {
    return this.http.post(this.apiUrl2, department);
  }

  //Actualizar departamento
  updateDepartment(id: string, department: Partial<Department>): Observable<Department> {
    return this.http.patch<Department>(`${this.apiUrl2}/${id}`, department);
  }

  //Eliminar empleado
  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/${id}`);
  }

  //Agregar miembro al departamento
  addMemberToDepartment(departmentId: string, member: Member): Observable<any> {
    return this.http.post(`${this.apiUrl2}/${departmentId}/members`, member);
  }
  
  //Traer a empleados disponibles pero no asignados
  getAvailableEmployees(departmentId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl2}/${departmentId}/available-employees`).pipe(
      map((response: any) => response.data)
    );
  }

  //Traer a los miembros del departamento
  getDepartmentMembers(departmentId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl2}/${departmentId}/members`).pipe(
      map((response: any) => response.data)
    );
  }
  
  //Traer la jerarquía del departamento
  getHierarchy(departmentId: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl2}/${departmentId}/hierarchy`);
  }

}