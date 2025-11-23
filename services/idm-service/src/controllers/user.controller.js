const S = require('../services/user.service');

/**
 * Create a new user.
 *
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user (admin)
 *     description: Creates a user directly without performing registration. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
const createUser = async (req, res, next) => {
  try {
    const created = await S.createUser(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

/**
 * Update an existing user.
 *
 * @openapi
 * /api/users/{userId}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Updates user attributes by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
const updateUser = async (req, res, next) => {
  try {
    res.json(await S.updateUser(req.params.userId, req.body));
  } catch (e) {
    next(e);
  }
};

/**
 * Get a user by ID.
 *
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user
 *     description: Retrieves details of a specific user. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
const getUser = async (req, res, next) => {
  try {
    res.json(await S.getUser(req.params.userId));
  } catch (e) {
    next(e);
  }
};

/**
 * List all users.
 *
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users
 *     description: Returns all users in the system. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
const listUsers = async (req, res, next) => {
  try {
    res.json(await S.getAllUsers());
  } catch (e) {
    next(e);
  }
};


module.exports = {
  createUser,
  updateUser,
  getUser,
  listUsers

};
