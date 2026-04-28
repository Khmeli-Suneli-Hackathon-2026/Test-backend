import 'dotenv/config';
import express from 'express';
import errorHandler from './src/middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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