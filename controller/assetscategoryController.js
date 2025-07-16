import AssetCategory from "../model/assetCategoryModel.js";

const addAssetCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const newCategory = await AssetCategory.create({
      categoryName,
      description,
    });
    res.redirect("/assetcategories/viewassetcategories");
  } catch (error) {
    console.log("Error creating asset category:", error);
  }
};

const viewassetcategories = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.findAll();
    res.render("viewassetcategories", {
      assetCategories: assetCategories,
      title: "Asset Categories",
    });
  } catch (error) {
    console.log("Error fetching asset categories:", error);
  }
};

const viewaddcategory = async (req, res) => {
  try {
    res.render("viewaddcategory", { title: "add asset category" });
  } catch (error) {
    console.log(error);
  }
};

const vieweditcategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const assetCategory = await AssetCategory.findByPk(categoryId);
    res.render("vieweditcategory", {
      assetCategory: assetCategory,
      title: "Edit Asset Category",
    });
  } catch (error) {
    console.log(error);
  }
};

const editcategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, description } = req.body;
    await AssetCategory.update(
      { categoryName, description },
      { where: { id: categoryId } }
    );
    res.redirect("/assetcategories/viewassetcategories");
  } catch (error) {
    console.log("Error updating asset category:", error);
  }
};

export {
  addAssetCategory,
  viewassetcategories,
  viewaddcategory,
  vieweditcategory,
  editcategory,
};
