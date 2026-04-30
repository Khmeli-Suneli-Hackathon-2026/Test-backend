import { db } from '../../services/db.js';
import { todos } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

const VALID_URGENCIES = ['LOW', 'MEDIUM', 'HIGH'];

export const getTodos = async (req, res, next) => {
    try {
        // req.user встановлюється middleware protect після верифікації JWT
        const userId = req.user.id;
        const { urgency } = req.query;

        // Валідація urgency (якщо передано)
        if (urgency && !VALID_URGENCIES.includes(urgency)) {
            res.status(400);
            throw new Error('Неприпустиме значення urgency. Використовуйте: LOW, MEDIUM або HIGH');
        }

        // Будуємо умову: завжди фільтруємо по userId, urgency — опціонально
        const whereClause = urgency
            ? and(eq(todos.userId, userId), eq(todos.urgency, urgency))
            : eq(todos.userId, userId);

        const userTodos = await db
            .select()
            .from(todos)
            .where(whereClause);

        res.status(200).json({
            success: true,
            data: userTodos,
        });
    } catch (error) {
        next(error);
    }
};
