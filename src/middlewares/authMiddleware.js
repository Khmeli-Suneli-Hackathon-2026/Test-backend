import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Перевіряємо заголовок Authorization (формат: Bearer <token>)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401);
            throw new Error('Доступ заборонено: токен відсутній');
        }

        // 2. Верифікація токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Додаємо дані користувача в об'єкт запиту (req.user)
        req.user = decoded;

        next(); 
    } catch (error) {
        res.status(401);
        next(new Error('Невірний або прострочений токен'));
    }
};