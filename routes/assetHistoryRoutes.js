import {getAssetHistory,viewallassets} from "../controller/assetHistoryController.js"
import express from 'express'


const assetHistoryRouter=express.Router()

assetHistoryRouter.get('/gethistory/:assetid',getAssetHistory)
assetHistoryRouter.get('/allassets',viewallassets)

export default assetHistoryRouter