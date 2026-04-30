import express from 'express';
import { createTodo } from '../../controllers/todos/createTodo.js';
import { getTodos } from '../../controllers/todos/getTodos.js';
import { updateTodo } from '../../controllers/todos/updateTodo.js';
import { deleteTodo } from '../../controllers/todos/deleteTodo.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTodos);
router.post('/', protect, createTodo);
router.put('/:id', protect, updateTodo);
router.delete('/:id', protect, deleteTodo);

export default router;