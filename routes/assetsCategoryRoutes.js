import { addAssetCategory,viewassetcategories ,viewaddcategory,vieweditcategory,editcategory} from "../controller/assetscategoryController.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.post("/addcategory", addAssetCategory);
categoryRouter.get('/viewassetcategories',viewassetcategories)
categoryRouter.get('/addassetcategory',viewaddcategory);
categoryRouter.get('/editcategory/:id',vieweditcategory);
categoryRouter.post('/editcategory/:id',editcategory);
export default categoryRouter;