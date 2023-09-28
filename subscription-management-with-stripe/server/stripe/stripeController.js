import stripe from '../config/stripe.js';
import User from '../user/userModel.js';
// import { findUserByCustomerId } from '../user/userController.js';

const BRONZE = 'BRONZE';
const BRONZE_PLAN_ID = process.env.BRONZE_PLAN_ID;

const SILVER = 'SILVER';
const SILVER_PLAN_ID = process.env.SILVER_PLAN_ID;

const GOLD = 'GOLD';
const GOLD_PLAN_ID = process.env.GOLD_PLAN_ID;

const STRIPE_SUCCESS_URL = 'http://localhost:3000/subscriptions';
const STRIPE_CANCEL_URL = 'http://localhost:3000/subscriptions';

const getSubscriptionPLanIds = async (req, res) => {
  return res.status(200).json({ BRONZE_PLAN_ID, SILVER_PLAN_ID, GOLD_PLAN_ID });
};

// Send 200 response to stripe
// !!! IMPORTANT !!!
// ...in order to listen to stripe webhooks you need one terminal to listen and NOT quit
//  and one terminal to send events
const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.WEBHOOK_SIGNING_SECRET);
  } catch (err) {
    console.log(err);
    // appendToLogFile(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    //  When you receive a checkout.session.completed event, you can provision the subscription.
    // Continue to provision each month (if billing monthly) as you receive invoice.paid events.
    //  If you receive an invoice.payment_failed event, notify your customer and send them to the customer portal to update their payment method.
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      const customerId = event.data.object.customer;
      const subscriptionId = event.data.object.subscription;
      // appendToLogFile(`checkout.session.completed: ${JSON.stringify(event.data.object)}`);
      // handleCheckoutSessionCompleted(customerId, subscriptionId);
      break;

    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Handle the customer.subscription.created event
      console.log('Hiiii subscription updated');
      handleSubscriptionUpdated(customerSubscriptionUpdated);
      break;

    // case 'invoice.paid':
    //   // Continue to provision the subscription as payments continue to be made.
    //   // Store the status in your database and check when a user accesses your service.
    //   // This approach helps you avoid hitting rate limits.
    //   console.log(event.data.object);
    //   appendToLogFile(`invoice.paid: ${JSON.stringify(event.data.object)}`);
    //   // const customerId = event.data.customer;
    //   // const customerEmail = event.data.customer_email;
    //   // const subscriptionId = event.data.object.subscription;

    //   const hosted_invoice_url = event.data.object.hosted_invoice_url;
    //   const invoice_pdf = event.data.object.invoice_pdf;

    //   console.log('hosted_invoice_url: ', hosted_invoice_url);
    //   console.log('invoice_pdf: ', invoice_pdf);
    //   // save payment to database
    //   handleInvoicePaid(event.data.object.customer, event.data.object.subscription);
    //   break;

    // case 'invoice.payment_failed':
    //   // The payment failed or the customer does not have a valid payment method.
    //   // The subscription becomes past_due. Notify your customer and send them to the
    //   // customer portal to update their payment information.
    //   break;
    default:
      // Unhandled event type
      console.log(`Unhandled event type ${event.type}`);
    // appendToLogFile(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
};

const createCustomerInternal = async (email, _id) => {
  // 2.create customer if needed
  let customer = {};
  try {
    customer = await stripe.customers.create({ email });
  } catch (error) {
    console.log(`Error creating customer: ${error}`);
    throw Error('Sorry could not create customer');
  }
  // 3.update user with customer id if needed
  try {
    await User.findByIdAndUpdate(_id, { customerId: customer.id });
  } catch (error) {
    console.log(`Error updating user: ${error}`);
    throw Error('Sorry could not add customer id to user');
  }
  return customer;
};

// TODO: Separate these two functions with next()
const createSubscriptionSession = async (req, res) => {
  let customer = {};
  const { plan } = req.body;
  const { email, customerId, _id } = req.user;
  let priceId;

  // 1.set price id based on plan && check if plan is valid
  if (plan.toLowerCase() === BRONZE.toLowerCase()) priceId = BRONZE_PLAN_ID;
  else if (plan.toLowerCase() === SILVER.toLowerCase()) priceId = SILVER_PLAN_ID;
  else if (plan.toLowerCase() === GOLD.toLowerCase()) priceId = GOLD_PLAN_ID;
  else {
    res.status(500).json({ error_message: 'No plan was selected' });
  }

  if (customerId) {
    customer.id = customerId;
  } else {
    try {
      customer = await createCustomerInternal(email, _id);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error_message: error });
    }
  }
  console.log(customer);

  try {
    // 3.create subscription session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
      success_url: STRIPE_SUCCESS_URL,
      cancel_url: STRIPE_CANCEL_URL,
      metadata: {
        message: 'Hello from metadata',
        plan: plan,
      },
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(`ERROR: Could not create checkout session`);
    console.log(error);
    res.status(500).json({ error_message: error.message });
  }
};

const createPortalSession = async (req, res) => {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: req.user.customerId,
      return_url: STRIPE_SUCCESS_URL,
    });

    res.status(200).json({ url: portalSession.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserSubscriptionDetails = async (req, res) => {
  const { id: subscriptionId } = req.params;
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    res.status(200).json({ subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occured, unable to retrieve subscription' });
  }
};

const getCustomerInvoices = async (req, res) => {
  if (!req.user.customerId) return res.status(500).json({ error: 'No customer id found' });
  try {
    const invoices = await stripe.invoices.list({
      customer: req.user.customerId,
    });
    res.status(200).json(invoices.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TODO: Are they needed???
// handles event checkout.session.completed from stripe
// 1. find user by customerId and add subscriptionId to user
// 2. subscription id remains the same even if user changes plan
// const handleCheckoutSessionCompleted = async (customerId, subscriptionId) => {
//   let user;
//   try {
//     user = await findUserByCustomerId(customerId);
//   } catch (error) {
//     // TODO: what should we do here?
//     console.log(error);
//   }
//   let subscriptionItem = { subscriptionId: subscriptionId };
//   user.subscriptions.push(subscriptionItem);

//   try {
//     await user.save();
//   } catch (error) {
//     console.log(error);
//   }
// };

const handleSubscriptionUpdated = async (customerSubscriptionUpdated) => {
  console.log('DEV: handleSubscriptionUpdated');
  const { customer } = customerSubscriptionUpdated;

  console.log(`DEV: customer: ${customer} has a new plan ${newPlan}`);
};

// handles event invoice.paid from stripe
// 1. find user by customerId and add subscriptionId to user
// 2. subscription id remains the same even if user changes plan
const handleInvoicePaid = async (customerId, subscriptionId) => {
  console.log(`DEV: handleInvoicePaid for customerId: ${customerId} and subscriptionId: ${subscriptionId}`);
};

const retrieveCustomerSubscriptions = async (customerId) => {
  try {
    const { data } = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// @desc Find user active subscription
const findUserActiveSubscription = async (customerId) => {
  try {
    const { data } = await stripe.subscriptions.list({
      customer: customerId,
    });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export {
  BRONZE,
  BRONZE_PLAN_ID,
  SILVER,
  SILVER_PLAN_ID,
  GOLD,
  GOLD_PLAN_ID,
  webhook,
  createSubscriptionSession,
  createPortalSession,
  getUserSubscriptionDetails,
  retrieveCustomerSubscriptions,
  getCustomerInvoices,
  findUserActiveSubscription,
  getSubscriptionPLanIds,
};

const findPlanByPlanIdInternal = (planId) => {
  const plan = BRONZE_PLAN_ID === planId ? BRONZE : SILVER_PLAN_ID === planId ? SILVER : GOLD_PLAN_ID === planId ? GOLD : null;
  return plan;
};
