import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
} from '../controllers/functions.controllers';

const router = Router();

router.post('/createUser', createUserController);
router.post('/deleteUser', deleteUserController);

export default router;
