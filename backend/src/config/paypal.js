// config/paypal.js
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const Environment = process.env.PAYPAL_MODE === 'live'
  ? checkoutNodeJssdk.core.LiveEnvironment
  : checkoutNodeJssdk.core.SandboxEnvironment;

const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);

export default paypalClient;
