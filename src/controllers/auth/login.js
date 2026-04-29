import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../services/db.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Шукаємо юзера в базі
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            res.status(401);
            throw new Error('Невірний email або пароль');
        }

        // 2. Порівнюємо паролі
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401);
            throw new Error('Невірний email або пароль');
        }

        // 3. Генеруємо токен
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Токен діє одну добу
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};