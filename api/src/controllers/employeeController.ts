import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Department from '../models/Department';
import { APIResponse } from '../types';

// Controlador de empleado
export const employeeController = {
  // Crear empleado
  async create(req: Request, res: Response) {
    try {
      const employee = new Employee({
        name: req.body.name,
        email: req.body.email
      });

      await employee.save();
      
      const response: APIResponse<typeof employee> = {
        success: true,
        data: employee
      };
      
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error creating employee'
      });
    }
  },
  // Actualizar empleado
  async update(req: Request, res: Response) {
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email
        },
        { new: true }
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
        });
      }

      const response: APIResponse<typeof employee> = {
        success: true,
        data: employee
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating employee'
      });
    }
  },

  // Obtener departamentos de un empleado
  async getDepartments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const departments = await Department.find({
        'members.employeeId': id
      }).select('name description');

      if (!departments.length) {
        return res.status(404).json({
          success: false,
          error: 'El empleado no pertenece a ningún departamento'
        });
      }

      const response: APIResponse<typeof departments> = {
        success: true,
        data: departments
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching employee departments'
      });
    }
  },

  // Obtener empleado por ID
  async getById(req: Request, res: Response) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
        });
      }

      // Obtener departamentos y roles del empleado
      const departments = await Department.find({
        'members.employeeId': employee._id
      }).select('name members');

      const employeeInfo = {
        ...employee.toObject(),
        departments: departments.map(dept => ({
          departmentId: dept._id,
          name: dept.name,
          role: dept.members.find(m => 
            m.employeeId.toString() === employee._id.toString()
          ),
        }))
      };

      const response: APIResponse<typeof employeeInfo> = {
        success: true,
        data: employeeInfo
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching employee'
      });
    }
  },

  // Obtener todos los empleados
  async getAll(req: Request, res: Response) {
    try {
      const employees = await Employee.find().sort({ name: 1 });
      
      const response: APIResponse<typeof employees> = {
        success: true,
        data: employees
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching employees'
      });
    }
  }
  
};