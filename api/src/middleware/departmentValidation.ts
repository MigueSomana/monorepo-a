import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Department from '../models/Department';
import Employee from '../models/Employee';

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.msg,
        message: err.msg
      }))
    });
  }
  next();
};

const isValidObjectId = (value: string) => mongoose.Types.ObjectId.isValid(value);

//Validadores de departamento
export const departmentValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('La descripción es requerida')
      .isLength({ min: 10, max: 500 })
      .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    handleValidationErrors
  ],
  update: [
      param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('ID de departamento inválido'),
      body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 5, max: 1000 })
        .withMessage('El nombre debe tener entre 5 y 1000 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
      handleValidationErrors
    ],

  addMember: [
    body('employeeId')
      .custom(isValidObjectId)
      .withMessage('ID de empleado inválido'),
    body('superiorId')
      .optional()
      .custom(isValidObjectId)
      .withMessage('ID de superior inválido'),
    handleValidationErrors
  ]
};

//Validación de que no haya jerarquía
export const checkHierarchyCircle = async (
  departmentId: string,
  employeeId: string,
  superiorId: string
): Promise<boolean> => {
  const department = await Department.findById(departmentId);
  if (!department) return false;

  const visited = new Set<string>();
  
  const dfs = (currentId: string, target: string): boolean => {
    if (currentId === target) return true;
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    
    const member = department.members.find(m => 
      m.employeeId.toString() === currentId
    );
    
    if (!member) return false;
    
    return member.subordinateIds.some(subId => 
      dfs(subId.toString(), target)
    );
  };

  return dfs(employeeId, superiorId);
};

//Validación de jerarquía
export const validateHierarchy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { departmentId } = req.params;
    const { employeeId, superiorId } = req.body;

    if (superiorId) {
      const hasCircle = await checkHierarchyCircle(
        departmentId,
        employeeId,
        superiorId
      );

      if (hasCircle) {
        return res.status(400).json({
          success: false,
          error: 'La jerarquía propuesta crearía una conexión circular'
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al validar la jerarquía'
    });
  }
};