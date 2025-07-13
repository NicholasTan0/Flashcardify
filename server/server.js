import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import cardRouter from './routes/cardRoute.js';
import setRouter from './routes/setRoute.js';

// app config
const app = express();
const port = process.env.PORT || 5050;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/card', cardRouter);
app.use('/api/set', setRouter);

app.get('/', (req, res) => {
    res.send('Hello, MongoDB and Express!');
});

app.listen(port, ()=> console.log("Server started on PORT: " + port));

