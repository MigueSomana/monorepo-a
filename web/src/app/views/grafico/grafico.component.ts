import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { GetApiService } from '../../services/get-api.service';
import { Edge, Node, DagreNodesOnlyLayout } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { CommonModule } from '@angular/common';
import { Department, Member } from '../../models/department';

@Component({
  selector: 'app-grafico',
  imports: [NgxGraphModule,CommonModule],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.scss'
})
export class GraficoComponent {
  //Input de departamento seleccionado
  @Input() department: Department | null = null;

  //Variables
  nodes: Node[] = [];
  edges: Edge[] = [];
  
  //Configuraciones del grafico
  layout = new DagreNodesOnlyLayout();
  curve = shape.curveStep;
  layoutSettings = {
    orientation: 'TB',
    marginX: 20,
    marginY: 20,
    edgePadding: 200,
    nodePadding: 200,
    rankPadding: 100
  };

  //Al cambiar cargar jerarquia
  ngOnChanges() {
    if (this.department && this.department._id) {
      this.loadHierarchyData(this.department._id);
    }
  }

  //Constructor del servicio y detector de cambios
  constructor(
    private apiService: GetApiService,
    private cd: ChangeDetectorRef
  ) {}

  //Cargar jerarquia
  private loadHierarchyData(departmentId: string) {
    this.apiService.getHierarchy(departmentId).subscribe({
      next: (response) => {
        if (response.success && response.data.members) {
          this.processHierarchyData(response.data.members);
          this.cd.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading hierarchy data:', error);
      }
    });
  }

  //Procesar jerarquia y agregar nodos y conexiones
  private processHierarchyData(members: Member[]) {
    this.nodes = [];
    this.edges = [];
    
    // Nodos
    members.forEach(member => {
      this.nodes.push({
        id: member.employeeId._id,
        label: member.employeeId.name,
        data: {
          name: member.employeeId.name,
          email: member.employeeId.email
        }
      });
  
      // Conexiones con el superior
      if (member.superiorId) {
        this.edges.push({
          source: member.superiorId._id,
          target: member.employeeId._id
        });
      }
  
    });

  }}