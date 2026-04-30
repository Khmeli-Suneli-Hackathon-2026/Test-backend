import express from 'express';
import { createTodo } from '../../controllers/todos/createTodo.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTodo);

export default router;