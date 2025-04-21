import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { address } = req.body;

  if (!address || address.trim() === "") {
    throw new apiError(400, "Shipping address is required");
  }

  const customer = await User.findById(userId).select(
    "-password -refreshToken -wishlist -isSeller"
  );
  // console.log(customer)
  if (!customer) {
    throw new apiError(404, "Customer not found");
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new apiError(400, "Your cart is empty");
  }
  // console.log(cart)

  let totalPrice = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    // console.log(product)
    if (!product) {
      throw new apiError(404, "Product not found in cart");
    }

    if (item.quantity > product.stock) {
      throw new apiError(
        400,
        `Insufficient stock for product: ${product.name}`
      );
    }

    totalPrice += item.quantity * product.price;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    customer: userId,
    orderItems,
    orderPrice: totalPrice,
    address,
  });

  cart.items = [];
  await cart.save();

  return res
    .status(200)
    .json(
      new apiResponse(200, { order, customer }, "Order placed successfully")
    );
});

const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const order = await Order.find({ customer: userId })
    .populate("orderItems.product", "name price productImage")
    .sort({ createdAt: -1 });

  // console.log(order)
  if (!order || order.length === 0) {
    throw new apiError(404, "No order found for this user");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order history fetch successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate("customer", "name email fullname phoneNumber")
    .populate("orderItems.product", "name price productImage owner");

  if (!order) {
    throw new apiError(404, "order not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Oder fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // const userId = req.user?._id.toString()

  const allowedStatus = ["PENDING", "CANCELED", "DELEVERED"];
  if (!status || !allowedStatus.includes(status.toUpperCase())) {
    throw new apiError(400, "Invalid or missing Status value");
  }

  const order = await Order.findById(id);
  // .populate("orderitems.product");

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  // const sellerOwnsItem =  order.orderItems.some(item =>{
  //   return item.product?.owner?.toString() === userId
  // })

  // if(!sellerOwnsItem){
  //   throw new apiError(403, "you are not authorized to update this order")
  // }

  order.status = status.toUpperCase();
  await order.save();

  return res
    .status(200)
    .json(
      new apiResponse(200, order, `order status updated to ${order.status}`)
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user?._id;

  const order = await Order.findById(id).populate("orderItems.product");

  if (!order) {
    throw new apiError(404, "order not found");
  }

  const unauthorizeditem = order.orderItems.find((item) => {
    return item.product?.owner?.toString() !== sellerId.toString();
  });

  if (unauthorizeditem) {
    throw new apiError(
      403,
      "you can only delete orders that contain only your products"
    );
  }

  if (order.status === "DELEVERED") {
    throw new apiError(400, "Delivered orders can not deleted");
  }

  await order.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Oder deleted successfully"));
});

export { createOrder, getOrder, getOrderById, updateOrderStatus, deleteOrder };
