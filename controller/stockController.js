import {Asset} from "../model/index.js";
import {AssetCategory} from "../model/index.js";
const stockview=async(req,res)=>{
    try {
         const stockAssets = await Asset.findAll({
      where: { status: 'available' },
      include: [{ model: AssetCategory, as: 'category' }] 
    });

        const branchTotals = {};
    let grandTotal = 0;

    stockAssets.forEach(asset => {
      if (!branchTotals[asset.branch]) {
        branchTotals[asset.branch] = { count: 0, assets: [] };
      }
      branchTotals[asset.branch].count++;
      branchTotals[asset.branch].assets.push(asset);
      grandTotal++;
    });

    res.render('stockview', { 
      branchTotals, 
      grandTotal,
      stockAssets,
      title:"view stock"
    });
    } catch (error) {
        console.log("error :",error)
    }
}


export { stockview };