import { indexPage } from "../controller/indexController.js";

import express from 'express'

const indexRouter=express.Router();

indexRouter.get("/",indexPage)

export default indexRouter;