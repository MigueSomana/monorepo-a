import express from 'express';
import { departmentController } from '../controllers/departmentController';
import { departmentValidators, validateHierarchy } from '../middleware/departmentValidation';

const router = express.Router();

// Rutas de departamento

router.post('/departments',
  departmentValidators.create,
  departmentController.create
);

router.post('/departments/:departmentId/members',
  departmentValidators.addMember,
  validateHierarchy,
  departmentController.addMember
);

router.get('/departments/:departmentId/hierarchy',
  departmentController.getDepartmentHierarchy
);

router.get('/departments/:departmentId/available-employees',
  departmentController.getAvailableEmployees
);

router.get('/departments/:departmentId/members',
  departmentController.getDepartmentMembers
);

router.get('/departments',
  departmentController.getAll
);

router.patch('/departments/:id',
  departmentValidators.update,
  departmentController.update
);

router.delete('/departments/:id',
  departmentController.delete
);

export default router;