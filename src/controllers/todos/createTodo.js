import { db } from '../../services/db.js';
import { todos } from '../../db/schema.js';

export const createTodo = async (req, res, next) => {
    try {
        const { title, description, urgency } = req.body;

        // 1. Валідація заголовка
        if (!title || title.trim() === "") {
            res.status(400);
            throw new Error('Заголовок задачі є обов’язковим');
        }

        // 2. Валідація терміновості (якщо вона передана)
        const validUrgencies = ['LOW', 'MEDIUM', 'HIGH'];
        if (urgency && !validUrgencies.includes(urgency)) {
            res.status(400);
            throw new Error('Неприпустиме значення терміновості. Використовуйте: LOW, MEDIUM або HIGH');
        }

        // 3. Збереження в базу
        // userId беремо з req.user, який додав наш protect middleware
        const result = await db.insert(todos).values({
            userId: req.user.id,
            title: title.trim(),
            description: description || '',
            urgency: urgency || 'LOW',
        });

        res.status(201).json({
            success: true,
            message: 'Задачу успішно створено',
            data: {
                id: result[0].insertId,
                title,
                urgency: urgency || 'LOW'
            }
        });
    } catch (error) {
        next(error);
    }
};