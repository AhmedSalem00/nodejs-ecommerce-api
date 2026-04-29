import productModel from "../models/productModels.js"; //Get All Products
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      success: true,
      message: "all products fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error In Fetching User Profile API",
      error,
    });
  }
};

//get product by id
export const getProductByIdController = async (req, res) => {
  try {
    //get product by id
    const product = await productModel.findById(req.params.id);
    //validate product
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "product fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error In  Fetching id product API",
      error,
    });
  }
};

//Create Product

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    //validation
    if (!name || !description || !price || !stock || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content, {
      folder: "products",
    });
    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      image: {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "product created successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error In Fetching User Profile API",
        error,
    });
  }
};
