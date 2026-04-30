import { db } from '../../services/db.js';
import { todos } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const deleteTodo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const todoId = Number(req.params.id);

        // 1. Перевіряємо чи задача існує і належить поточному юзеру
        const [existingTodo] = await db
            .select()
            .from(todos)
            .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));

        if (!existingTodo) {
            res.status(404);
            throw new Error('Задачу не знайдено або вона вам не належить');
        }

        // 2. Видаляємо задачу
        await db
            .delete(todos)
            .where(eq(todos.id, todoId));

        res.status(200).json({
            success: true,
            message: 'Задачу успішно видалено',
        });
    } catch (error) {
        next(error);
    }
};
