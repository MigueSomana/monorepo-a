import { Request, Response } from 'express';
import Department from '../models/Department';
import Employee from '../models/Employee';
import { APIResponse } from '../types';
import mongoose from 'mongoose';

//Controlador de departamento
export const departmentController = {
  //Crear departamento
  async create(req: Request, res: Response) {
    try {
      const department = new Department({
        name: req.body.name,
        description: req.body.description,
        members: []
      });

      await department.save();
      
      const response: APIResponse<typeof department> = {
        success: true,
        data: department
      };
      
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error creating department'
      });
    }
  },
  //Actualizar departamento
  async update(req: Request, res: Response) {
    try {
      const department = await Department.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description
        },
        { new: true }
      );

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }

      const response: APIResponse<typeof department> = {
        success: true,
        data: department
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating department'
      });
    }
  },

  //Eliminar departamento
  async delete(req: Request, res: Response) {
    try {
      const department = await Department.findById(req.params.id);
      
      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }

      // Verificar si el departamento tiene miembros, puede ser util pero de momento no se usa
      /*if (department.members.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'No se puede eliminar un departamento con miembros activos'
        });
      }*/

      await department.deleteOne();

      res.json({
        success: true,
        message: 'Departamento eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error deleting department'
      });
    }
  },

  //Obtener el numero de miembros
  async getMemberCount(req: Request, res: Response) {
    try {
      const department = await Department.findById(req.params.id);
      
      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }

      const response: APIResponse<number> = {
        success: true,
        data: department.members.length
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error getting member count'
      });
    }
  },

  //Agregar miembro al departamento
  async addMember(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      const { employeeId, superiorId } = req.body;

      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }

      // Verificar si el empleado ya es miembro
      if (department.members.some(m => m.employeeId.toString() === employeeId)) {
        return res.status(400).json({
          success: false,
          error: 'El empleado ya es miembro del departamento'
        });
      }

      // Verificar si el superior existe en el departamento
      if (superiorId && !department.members.some(m => m.employeeId.toString() === superiorId)) {
        return res.status(400).json({
          success: false,
          error: 'El superior seleccionado no es miembro del departamento'
        });
      }

      // Agregar nuevo miembro
      department.members.push({
        employeeId: new mongoose.Types.ObjectId(employeeId),
        ...(superiorId && { superiorId: new mongoose.Types.ObjectId(superiorId) }),
        subordinateIds: []
      });

      // Si tiene superior, agregarlo como subordinado del superior
      if (superiorId) {
        const superiorMember = department.members.find(
          m => m.employeeId.toString() === superiorId
        );
        if (superiorMember) {
          superiorMember.subordinateIds.push(new mongoose.Types.ObjectId(employeeId));
        }
      }

      await department.save();

      await department.populate('members.employeeId members.superiorId', 'name email');

      const response: APIResponse<typeof department> = {
        success: true,
        data: department
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error adding member to department'
      });
    }
  },

  //Obtener jerarquia del departamento
  async getDepartmentHierarchy(req: Request, res: Response) {
    try {
      const department = await Department.findById(req.params.departmentId)
        .populate('members.employeeId', 'name email')
        .populate('members.superiorId', 'name email')
        .populate('members.subordinateIds', 'name email');

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }

      const response: APIResponse<typeof department> = {
        success: true,
        data: department
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching department hierarchy'
      });
    }
  },
  

  //Traer todos los departamentos
  async getAll(req: Request, res: Response) {
    try {
      const departments = await Department.find().sort({ name: 1 });
      
      const response: APIResponse<typeof departments> = {
        success: true,
        data: departments
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching departments'
      });
    }
  },
  
  //Ver los empleados disponibles que no estan en el departamento
  async getAvailableEmployees(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }
      const memberIds = department.members.map((m: { employeeId: any; }) => m.employeeId);

      const availableEmployees = await Employee.find({
        _id: { $nin: memberIds }
      }).select('name email');

      const response: APIResponse<typeof availableEmployees> = {
        success: true,
        data: availableEmployees
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo empleados disponibles'
      });
    }
  },

  //Obtener los miembros del departamento
  async getDepartmentMembers(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      
      const department = await Department.findById(departmentId)
        .populate('members.employeeId', 'name email');

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Departamento no encontrado'
        });
      }
      const members = department.members.map((m: { employeeId: any; }) => m.employeeId);

      const response: APIResponse<typeof members> = {
        success: true,
        data: members
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo miembros del departamento'
      });
    }
  }
};