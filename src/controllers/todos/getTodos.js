import { db } from '../../services/db.js';
import { todos } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const getTodos = async (req, res, next) => {
    try {
        // req.user встановлюється middleware protect після верифікації JWT
        const userId = req.user.id;

        const userTodos = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, userId));

        res.status(200).json({
            success: true,
            data: userTodos,
        });
    } catch (error) {
        next(error);
    }
};
