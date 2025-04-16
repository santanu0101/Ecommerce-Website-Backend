import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price productImage",
  });

  if (!cart || cart.items.length === 0) {
    throw new apiError(404, "Cart is Empty");
  }

  return res
    .status(200)
    .json(new apiResponse(200, cart, "Cart fetch Successfully"));
});

const addCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new apiError(400, "Product ID is required");
  }

  //   console.log(productId)
  const product = await Product.findById(productId);

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    console.log(itemIndex);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  return res
    .status(200)
    .json(new apiResponse(200, cart, "Item added to cart successfully"));
});

const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  // console.log(userId)

  if (!quantity || quantity < 1) {
    throw new apiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new apiError(404, "Cart item not found");
  }

  item.quantity = quantity;

  return res
    .status(200)
    .json(new apiResponse(200, cart, "cart item updated successfully"));
});

const removeCartItems = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new apiError(404, "cart not found");
  }

  // const item = cart.items.id(itemId);
  const item = cart.items.find((i)=> i._id.toString() === itemId)

  if (!item) {
    throw new apiError(404, "cart item not found");
  }

  // item.remove();
  cart.items.pull(itemId)
  await cart.save();

  return res
    .status(200)
    .json(new apiResponse(200, cart, "Item removed from cart"));
});


const clearCart = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const cart = await Cart.findOne({user: userId})
  if(!cart){
    throw new apiError(404, "cart not found")
  }

  cart.items = []
  await cart.save();

  return res.status(200).json(new apiResponse(200, cart, "Cart cleared successfully"))
})


const getCartTotal = asyncHandler(async(req, res)=>{
  const userId = req.user?._id;
  // console.log(userId)

  const cart  = await Cart.findOne({user: userId}).populate("items.product")

  if(!cart){
    throw new apiError(404, "cart not found")
  }

  let total = 0

  for( const item of cart.items){
    if(!item.product) continue
    total += item.quantity * item.product.price
  }

  return res.status(200).json(new apiResponse(200, {total}, "Cart total calculated"))
})

export { getCart, addCart, updateCart, removeCartItems, clearCart, getCartTotal };
