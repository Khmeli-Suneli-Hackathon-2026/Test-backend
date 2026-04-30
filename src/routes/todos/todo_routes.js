import express from 'express';
import { createTodo } from '../../controllers/todos/createTodo.js';
import { getTodos } from '../../controllers/todos/getTodos.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTodos);
router.post('/', protect, createTodo);

export default router;