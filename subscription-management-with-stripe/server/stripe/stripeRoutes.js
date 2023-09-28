import express from 'express';
import {
  createSubscriptionSession,
  webhook,
  createPortalSession,
  getUserSubscriptionDetails,
  getCustomerInvoices,
  getSubscriptionPLanIds,
} from './stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/create-subscription-session').post(protect, createSubscriptionSession);
router.route('/create-portal-session').post(protect, createPortalSession);
router.route('/get-subscription/:id').get(protect, getUserSubscriptionDetails);
router.route('/get-invoices-of-user').get(protect, getCustomerInvoices);
router.route('/get-subscription-plan-ids').get(getSubscriptionPLanIds);
router.route('/webhook').post(webhook);
export default router;
