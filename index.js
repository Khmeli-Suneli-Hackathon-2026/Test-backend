import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './src/middlewares/errorMiddleware.js';
import register_route from './src/routes/auth/register_route.js';
import login_route from './src/routes/auth/login_route.js';
import todo_routes from './src/routes/todos/todo_routes.js';

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', register_route);
app.use('/api/auth', login_route);
app.use('/api/todos', todo_routes);

app.get('/', (req, res) => {
    res.send('API працює!');
});

app.get('/error', (req, res, next) => {
    const err = new Error('Smth went wrong!');
    res.status(400);
    next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});