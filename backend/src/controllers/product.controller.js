import { Catagory } from "../models/catagory.model.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();

  if (product.length === 0) {
    throw new apiError(404, "No product here right now");
  }

  return res
    .status(200)
    .json(new apiResponse(200, product, "All product fetch successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ id });

  if (!product) {
    throw new apiError(404, "product not found");
  }

  return res.status(200).json(new apiResponse(200, product, "Product found"));
});

const addProduct = asyncHandler(async (req, res) => {
  const { description, name, productImage, price, stock, catagory } = req.body;

  if (!description || !name || !productImage || !price || !stock || !catagory) {
    throw new apiError(403, "All fields required");
  }

  let existingCategory = await Catagory.findOne({ name: catagory });

  if (!existingCategory) {
    existingCategory = await Catagory.create({
      name: catagory.toLowerCase(),
    });
  }

  const product = await Product.create({
    description,
    name,
    productImage,
    price,
    stock,
    catagory: existingCategory._id,
    owner: req.user?._id || null,
  });

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product added Successfully"));
});

const updateProducts = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const product = await Product.findById(id);

    if (!product) {
      throw new apiError(404, "product not found");
    }

    if (product.owner?.toString() !== req.user?._id.toString()) {
      throw new apiError(403, "You are not authorized to update this product");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new apiError(403, "Data is required");
    }

    if (updateData.catagory) {
      const existingCategory = await Catagory.findOne({
        name: updateData.catagory,
      });

      if (!existingCategory) {
        // Create new category if not exists
        const newCategory = await Catagory.create({
          name: updateData.catagory,
        });
        updateData.catagory = newCategory._id;
      } else {
        updateData.catagory = existingCategory._id;
      }
    }

    const updateProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateProduct) {
      throw new apiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, updateProduct, "Product update Successfully"));
  } catch (error) {
    throw new apiError(500, error.message || "Internal Server Error");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new apiError(404, "Product is not found");
  }

  if (product.owner?.toString() !== req.user?._id.toString()) {
    throw new apiError(403, "You are not authorized to delete product");
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Delete product successfully"));
});

export { getAllProduct, getProductById, addProduct, updateProducts, deleteProduct };
