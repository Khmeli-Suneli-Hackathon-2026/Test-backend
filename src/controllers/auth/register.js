import bcrypt from 'bcrypt';
import { db } from '../services/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Валідація
        if (!email || !password) {
            res.status(400);
            throw new Error('Email та пароль обов’язкові');
        }

        // Перевірка чи юзер вже є
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            res.status(400);
            throw new Error('Користувач з таким email вже існує');
        }

        // Хешування
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Збереження
        await db.insert(users).values({
            email,
            passwordHash: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: 'Користувача створено'
        });
    } catch (error) {
        next(error);
    }
};