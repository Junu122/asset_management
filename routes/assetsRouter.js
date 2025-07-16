import { addAsset ,getAllAssets,viewAllAssets,viewAddasset,vieweditasset,editasset,assetIssue,viewissueasset,returnAsset,viewreturnasset,scrapAsset,viewscrapasset} from "../controller/assetsController.js";
import express from 'express';

const assetsRouter = express.Router();

assetsRouter.post("/addasset", addAsset);
assetsRouter.get('/addasset',viewAddasset)
assetsRouter.get("/getallassets",getAllAssets )
assetsRouter.get("/viewallassets",viewAllAssets )
assetsRouter.get("/edit/:id",vieweditasset)
assetsRouter.post('/edit/:id',editasset)
assetsRouter.post("/issueasset",assetIssue)
assetsRouter.get("/issueasset",viewissueasset)
assetsRouter.post("/returnasset/:id",returnAsset)
assetsRouter.get("/returnasset",viewreturnasset)
assetsRouter.post("/scrapasset/:id",scrapAsset)
assetsRouter.get("/scrapasset",viewscrapasset)
export default assetsRouter;