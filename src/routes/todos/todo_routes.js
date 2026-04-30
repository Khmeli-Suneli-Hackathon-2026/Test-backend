import express from 'express';
import { createTodo } from '../../controllers/todos/createTodo.js';
import { getTodos } from '../../controllers/todos/getTodos.js';
import { updateTodo } from '../../controllers/todos/updateTodo.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTodos);
router.post('/', protect, createTodo);
router.put('/:id', protect, updateTodo);

export default router;