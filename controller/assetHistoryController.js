import { Asset } from "../model/index.js";
import { AssetHistory } from "../model/index.js";
import { Employee } from "../model/index.js";
const getAssetHistory = async (req, res) => {
  try {
    const assetId = req.params.assetid;

    const asset = await Asset.findByPk(assetId, {
      include: [
        {
          model: AssetHistory,
          as: "history",
          include: [{ model: Employee, as: "employee" }],
          order: [["actionDate", "DESC"]],
        },
      ],
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }


    const purchaseHistory = asset.history.find((h) => h.action === "PURCHASE");
    if (!purchaseHistory && asset.purchaseDate) {
      await AssetHistory.create({
        assetId: assetId,
        action: "PURCHASE",
        actionDate: asset.purchaseDate,
        remarks: "Asset purchased", // Default system user
      });
    }

    const updatedAsset = await Asset.findByPk(assetId, {
      include: [
        {
          model: AssetHistory,
          as: "history",
          include: [{ model: Employee, as: "employee" }],
          order: [["actionDate", "DES"]],
        },
      ],
    });
    res.render("viewassethistory", { asset: updatedAsset });
    // res.json({
    //   success: true,
    //   asset: updatedAsset,
    //   history: updatedAsset.history
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewallassets = async (req, res) => {
  try {
    const assets = await Asset.findAll({});
    res.render("viewallassets", { assets, title: "all assets" });
  } catch (error) {
    console.log(error);
  }
};

export { getAssetHistory, viewallassets };
