import express from 'express';
import { addCard, removeCard, updateCard } from '../controllers/cardController.js';
import upload from '../middleware/multer.js';

const cardRouter = express.Router();

cardRouter.post('/add', upload.fields([{name: 'termImg', maxCount:1},{name: 'definitionImg', maxCount:1}]), addCard);
cardRouter.delete('/remove', removeCard);
cardRouter.patch('/update/:id', upload.fields([{name: 'termImg', maxCount:1},{name: 'definitionImg', maxCount:1}]), updateCard)

export default cardRouter;
