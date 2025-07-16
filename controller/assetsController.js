import { Asset } from "../model/index.js";
import { AssetCategory } from "../model/index.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { Employee } from "../model/index.js";
import { AssetHistory } from "../model/index.js";
const addAsset = async (req, res) => {
  try {
    console.log("request body:", req.body);
    const {
      assetType,
      name,
      serialNumber,
      make,
      model,
      purchaseDate,
      status,
      branch,
    } = req.body;
    const newAsset = await Asset.create({
      assetType,
      name,
      serialNumber,
      make,
      model,
      purchaseDate,
      status,
      branch,
    });
    res.redirect("/assets/viewallassets");
    // res.json({
    //     message: "Asset created successfully",
    //     newAsset
    // });
  } catch (error) {
    return res.status(500).json({ message: "Error creating asset", error });
    console.log("Error creating asset:", error);
  }
};

const viewAddasset = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.findAll();
    res.render("viewaddasset", {
      assetCategories: assetCategories,
      title: "add asset",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        {
          model: AssetCategory,
          as: "category",
        },
      ],
    });
    res.json(assets);
  } catch (error) {
    console.log("Error fetching assets:", error);
  }
};

const viewAllAssets = async (req, res) => {
  try {
    const { categoryId, draw, start, length } = req.query;
    console.log("Query parameters:", req.query["search[value]"]);
    console.log("type of search  :", typeof req.query["search[value]"]);
    const search = req.query["search[value]"];
    let queryOptions = {
      where: {
        status: {
          [Op.ne]: "SCRAPPED",
        },
      },
      include: [
        {
          model: AssetCategory,
          as: "category",
        },
      ],
    };

    if (categoryId && categoryId !== "all") {
      queryOptions.where = {
        assetType: categoryId,
      };
    }

    if (search) {
      const searchTerm = search;
      queryOptions.where = {
        ...queryOptions.where,
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { serialNumber: { [Op.like]: `%${searchTerm}%` } },
          { make: { [Op.like]: `%${searchTerm}%` } },
          { model: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    if (req.xhr || req.headers.accept.indexOf("json") > -1 || draw) {
      const offset = parseInt(start) || 0;
      const limit = parseInt(length) || 10;

      queryOptions.offset = offset;
      queryOptions.limit = limit;

      const { count, rows: assets } = await Asset.findAndCountAll(queryOptions);

      return res.json({
        draw: parseInt(draw),
        recordsTotal: count,
        recordsFiltered: count,
        data: assets.map((asset) => ({
          id: asset.id,
          name: asset.name,
          serialNumber: asset.serialNumber,
          make: asset.make,
          model: asset.model,
          category: asset.category ? asset.category.categoryName : "N/A",
          purchaseDate: asset.purchaseDate
            ? asset.purchaseDate.toISOString().split("T")[0]
            : "N/A",
          branch: asset.branch,
        })),
      });
    }

    const assets = await Asset.findAll(queryOptions);
    const assetCategories = await AssetCategory.findAll();

    console.log("Assets fetched:", assets.length);
    console.log("Asset categories fetched:", assetCategories.length);

 
    res.render("viewAssets", {
      assets,
      assetCategories,
      title: "View All Assets",
    });
  } catch (error) {
    console.log("Error fetching assets:", error);
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.status(500).json({ error: "Error fetching assets" });
    }
  }
};

const vieweditasset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const asset = await Asset.findByPk(assetId, {
      include: [
        {
          model: AssetCategory,
          as: "category",
        },
      ],
    });
    if (!asset) {
      return res.status(404).send("Asset not found");
    }
    const assetCategories = await AssetCategory.findAll();
    res.render("vieweditasset", {
      asset,
      assetCategories,
      title: "Edit Asset",
    });
  } catch (error) {
    console.log("Error fetching asset for edit:", error);
  }
};

const editasset = async (req, res) => {
  try {
    const assetid = req.params.id;
    const { assetType, name, serialNumber, make, model, purchaseDate, branch } =
      req.body;
    const asset = await Asset.findByPk(assetid);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    asset.assetType = assetType;
    asset.name = name;
    asset.serialNumber = serialNumber;
    asset.make = make;
    asset.model = model;
    asset.purchaseDate = purchaseDate;

    asset.branch = branch;
    await asset.save();
    res.redirect("/assets/viewallassets");
    // res.json({ message: "Asset updated successfully", asset });
  } catch (error) {
    console.log("Error updating asset:", error);
    res.status(500).json({ message: "Error updating asset", error });
  }
};

const assetIssue = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { assetId, employeeId } = req.body;
    console.log("type of assetid", typeof assetId);
    console.log("assetid", assetId);

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    if (asset.status !== "available") {
      return res
        .status(400)
        .json({ error: "Asset is not available for issue" });
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await asset.update(
      {
        status: "ISSUED",
        currentEmployeeId: employeeId,
        issuedDate: new Date(),
      },
      { transaction }
    );

    await AssetHistory.create(
      {
        assetId: assetId,
        employeeId: employeeId,
        action: "ISSUE",
        actionDate: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    res.redirect("/assets/issueasset");
    res.json({
      success: true,
      message: "Asset issued successfully",
      asset: await Asset.findByPk(assetId, {
        include: [{ model: Employee, as: "currentEmployee" }],
      }),
    });
  } catch (error) {
    console.log("Error issuing asset:", error);
    res.status(500).json({ message: "Error issuing asset", error });
  }
};

const viewissueasset = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: "available" },
      include: [{ model: AssetCategory, as: "category" }],
    });
    const employees = await Employee.findAll({
      where: { isActive: true },
    });

    res.render("viewissueasset", { assets, employees, title: "Issue Asset" });
  } catch (error) {
    console.log("Error fetching assets for issue:", error);
    res.status(500).json({ message: "Error fetching assets for issue", error });
  }
};

const returnAsset = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const assetId = req.params.id;
    const { reason } = req.body;

    console.log("assetId     :", assetId);


    const asset = await Asset.findByPk(assetId, {
      include: [{ model: Employee, as: "currentEmployee" }],
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    if (asset.status !== "ISSUED") {
      return res.status(400).json({ error: "Asset is not currently issued" });
    }

    const previousEmployeeId = asset.currentEmployeeId;

    await asset.update(
      {
        status: "available",
        currentEmployeeId: null,
        issuedDate: null,
      },
      { transaction }
    );

    await AssetHistory.create(
      {
        assetId: assetId,
        employeeId: previousEmployeeId,
        action: "RETURN",
        actionDate: new Date(),
        reason: reason,
      },
      { transaction }
    );

    await transaction.commit();
    res.redirect("/assets/returnasset");
    res.json({
      success: true,
      message: "Asset returned successfully",
      asset: await Asset.findByPk(assetId),
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const viewreturnasset = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: "ISSUED" },
      include: [{ model: Employee, as: "currentEmployee" }],
    });

    res.render("viewreturnasset", { assets, title: "return  Asset" });
  } catch (error) {
    return error;
  }
};

const scrapAsset = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const assetId = req.params.id;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    if (asset.status === "SCRAPPED") {
      return res.status(400).json({ error: "Asset is already scrapped" });
    }

    const previousEmployeeId = asset.currentEmployeeId;

    await asset.update(
      {
        status: "SCRAPPED",
        currentEmployeeId: null,
        issuedDate: null,
      },
      { transaction }
    );

    await AssetHistory.create(
      {
        assetId: assetId,
        employeeId: previousEmployeeId,
        action: "SCRAP",
        actionDate: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    res.redirect("/assets/scrapasset");
    res.json({
      success: true,
      message: "Asset scrapped successfully",
      asset: await Asset.findByPk(assetId),
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const viewscrapasset = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: {
        status: {
          [Op.ne]: "SCRAPPED",
        },
      },
    });

    res.render("viewscrap", { assets, title: "scrap asset" });
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).send("Internal Server Error");
  }
};

export {
  addAsset,
  getAllAssets,
  viewAllAssets,
  viewAddasset,
  vieweditasset,
  editasset,
  assetIssue,
  viewissueasset,
  returnAsset,
  viewreturnasset,
  scrapAsset,
  viewscrapasset,
};
