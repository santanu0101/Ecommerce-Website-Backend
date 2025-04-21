import { Catagory } from "../models/catagory.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getCatagory = asyncHandler(async (req, res) => {
  const catagories = await Catagory.find();

  if (!catagories || catagories.length === 0) {
    throw new apiError(404, "No catagory found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, catagories, "Catagories fetch successfully"));
});

const createCatagory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new apiError(400, "catagory name is required");
  }

  const existing = await Catagory.findOne({ name: name.trim().toLowerCase() });

  if (existing) {
    throw new apiError(409, "Catagory already exist");
  }

  const newCatagory = await Catagory.create({
    name: name.trim().toLowerCase(),
  });

  return res
    .status(200)
    .json(new apiResponse(200, newCatagory, "Catagory created successfully"));
});

const updateCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new apiError(400, "catagory name is required");
  }

  const existing = await Catagory.findOne({
    name: name.trim().toLowerCase(),
    _id: { $ne: id },
  });

  if (existing) {
    throw new apiError(409, "catagory name already exists");
  }

  const updatedCatagory = await Catagory.findByIdAndUpdate(
    id,
    { name: name.trim().toLowerCase() },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, updateCatagory, "Catagory updated successfully")
    );
});

const deleteCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const catagory = await Catagory.findById(id);
  if (!catagory) {
    throw new apiError(404, "Catagory not found");
  }

  const LikedProduct = await Product.find({ catagory: id });

  if (LikedProduct) {
    throw new apiError(
      400,
      "cannot delete catagory, product are still linkrd tyo this catagory"
    );
  }

  await catagory.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Catagory deleted successfully"));
});

export { getCatagory, createCatagory, updateCatagory, deleteCatagory };
