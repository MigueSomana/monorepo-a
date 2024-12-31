import express from 'express';
import { employeeController } from '../controllers/employeeController';
import { employeeValidators } from '../middleware/employeeValidation';

const router = express.Router();

// Rutas de empleado

router.post('/employees',
  employeeValidators.create,
  employeeController.create
);

router.patch('/employees/:id',
  employeeValidators.update,
  employeeController.update
);

router.get('/employees',
  employeeController.getAll
);


export default router;