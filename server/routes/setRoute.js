import express from 'express';
import {addSet, removeSet, listSets, singleSet, pushSet, pullSet, updateSet} from '../controllers/setController.js';
import upload from '../middleware/multer.js';

const setRouter = express.Router();

setRouter.post('/add', upload.single('diagram'), addSet);
setRouter.delete('/remove/:id', removeSet);
setRouter.get('/list', listSets);
setRouter.post('/single', singleSet);
setRouter.patch('/push/:id', pushSet);
setRouter.patch('/pull/:id', pullSet);
setRouter.patch('/update/:id', upload.single('diagram'), updateSet);

export default setRouter;