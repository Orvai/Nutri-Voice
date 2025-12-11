const S = require('../services/subscription.service');

/**
 * @openapi
 * /internal/subscriptions:
 *   post:
 *     tags:
 *       - IDM - Subscriptions
 *     summary: Create a subscription (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_CreateSubscriptionRequestDto'
 *     responses:
 *       200:
 *         description: Created subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SubscriptionResponseDto'
 */
const createSubscription = async (req, res, next) => {
  try {
    const data = await S.createSubscription(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/subscriptions/{id}:
 *   patch:
 *     tags:
 *       - IDM - Subscriptions
 *     summary: Update a subscription (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_UpdateSubscriptionRequestDto'
 *     responses:
 *       200:
 *         description: Updated subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SubscriptionResponseDto'
 */
const updateSubscription = async (req, res, next) => {
  try {
    const data = await S.updateSubscription(req.params.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/subscriptions/{id}:
 *   delete:
 *     tags:
 *       - IDM - Subscriptions
 *     summary: Delete a subscription (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SubscriptionResponseDto'
 */
const deleteSubscription = async (req, res, next) => {
  try {
    const data = await S.deleteSubscription(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/subscriptions/{id}:
 *   get:
 *     tags:
 *       - IDM - Subscriptions
 *     summary: Get a subscription by ID (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SubscriptionResponseDto'
 */
const getSubscription = async (req, res, next) => {
  try {
    const data = await S.getSubscription(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/subscriptions:
 *   get:
 *     tags:
 *       - IDM - Subscriptions
 *     summary: List subscriptions (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IDM_SubscriptionResponseDto'
 */
const listSubscriptions = async (req, res, next) => {
  try {
    const data = await S.getAllSubscriptions();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscription,
  listSubscriptions,
};