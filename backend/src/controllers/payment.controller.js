import { asyncHandler } from "../utils/asyncHandler.js";
import paypalClient from '../config/paypal.js';
import paypal from '@paypal/checkout-server-sdk';

const createPayPalOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: amount.toString()
      }
    }]
  });

  const order = await paypalClient.execute(request);

  return res.status(200).json(new apiResponse(200, {
    orderID: order.result.id
  }, 'PayPal order created'));
});


const capturePayPalOrder = asyncHandler(async (req, res) => {
    const { orderID } = req.body;
  
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
  
    return res.status(200).json(new apiResponse(200, capture.result, 'Payment successful'));
  });
  


export {createPayPalOrder, capturePayPalOrder}