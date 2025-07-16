import express from 'express';
import { stockview } from '../controller/stockController.js';

const stockRouter = express.Router();


stockRouter.get('/viewstocks', stockview);


export default stockRouter;