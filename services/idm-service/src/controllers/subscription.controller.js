const S = require('../services/subscription.service');

/**
 * Create a new subscription.
 *
 * @openapi
 * /api/subscriptions:
 *   post:
 *     tags:
 *       - Subscriptions
 *     summary: Create subscription
 *     description: Creates a subscription for a user. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionInput'
 *     responses:
 *       200:
 *         description: Subscription created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Related resource not found
 */
const createSubscription = async (req, res, next) => {
  try {
    res.json(await S.createSubscription(req.body));
  } catch (e) { next(e); }
};

/**
 * Update an existing subscription.
 *
 * @openapi
 * /api/subscriptions/{id}:
 *   patch:
 *     tags:
 *       - Subscriptions
 *     summary: Update subscription
 *     description: Updates subscription details by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateSubscriptionInput'
 *     responses:
 *       200:
 *         description: Subscription updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subscription or related resource not found
 */
const updateSubscription = async (req, res, next) => {
  try {
    res.json(await S.updateSubscription(req.params.id, req.body));
  } catch (e) { next(e); }
};

/**
 * Delete a subscription.
 *
 * @openapi
 * /api/subscriptions/{id}:
 *   delete:
 *     tags:
 *       - Subscriptions
 *     summary: Delete subscription
 *     description: Deletes a subscription by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *               required: [deleted]
 *       404:
 *         description: Subscription not found
 */
const deleteSubscription = async (req, res, next) => {
  try {
    res.json(await S.deleteSubscription(req.params.id));
  } catch (e) { next(e); }
};

/**
 * Retrieve a subscription by ID.
 *
 * @openapi
 * /api/subscriptions/{id}:
 *   get:
 *     tags:
 *       - Subscriptions
 *     summary: Get subscription
 *     description: Retrieves subscription details by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 */
const getSubscription = async (req, res, next) => {
  try {
    res.json(await S.getSubscription(req.params.id));
  } catch (e) { next(e); }
};

/**
 * List all subscriptions.
 *
 * @openapi
 * /api/subscriptions:
 *   get:
 *     tags:
 *       - Subscriptions
 *     summary: List subscriptions
 *     description: Returns all subscriptions. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
const listSubscriptions = async (req, res, next) => {
  try {
    res.json(await S.getAllSubscriptions());
  } catch (e) { next(e); }
};


module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscription,
  listSubscriptions,
};
