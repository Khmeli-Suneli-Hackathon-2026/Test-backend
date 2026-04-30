import { db } from '../../services/db.js';
import { todos } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

const VALID_URGENCIES = ['LOW', 'MEDIUM', 'HIGH'];

export const updateTodo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const todoId = Number(req.params.id);
        const { title, description, urgency } = req.body;

        // 1. Перевіряємо чи задача існує і належить поточному юзеру
        const [existingTodo] = await db
            .select()
            .from(todos)
            .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));

        if (!existingTodo) {
            res.status(404);
            throw new Error('Задачу не знайдено або вона вам не належить');
        }

        // 2. Валідація полів (якщо передані)
        if (title !== undefined && title.trim() === '') {
            res.status(400);
            throw new Error('Заголовок не може бути порожнім');
        }

        if (urgency !== undefined && !VALID_URGENCIES.includes(urgency)) {
            res.status(400);
            throw new Error('Неприпустиме значення urgency. Використовуйте: LOW, MEDIUM або HIGH');
        }

        // 3. Формуємо об'єкт оновлення (тільки передані поля)
        const updateData = {};
        if (title !== undefined)       updateData.title = title.trim();
        if (description !== undefined) updateData.description = description;
        if (urgency !== undefined)     updateData.urgency = urgency;

        if (Object.keys(updateData).length === 0) {
            res.status(400);
            throw new Error('Не передано жодного поля для оновлення');
        }

        // 4. Оновлення в базі
        await db
            .update(todos)
            .set(updateData)
            .where(eq(todos.id, todoId));

        res.status(200).json({
            success: true,
            message: 'Задачу успішно оновлено',
            data: { id: todoId, ...existingTodo, ...updateData },
        });
    } catch (error) {
        next(error);
    }
};
