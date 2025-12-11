const S = require('../services/user.service');

/**
 * @openapi
 * /internal/users:
 *   post:
 *     tags:
 *       - IDM - Users
 *     summary: Create a new user (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_CreateUserRequestDto'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_UserResponseDto'
 */
const createUser = async (req, res, next) => {
  try {
    const data = await S.createUser(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/users/{userId}:
 *   patch:
 *     tags:
 *       - IDM - Users
 *     summary: Update an existing user (internal)
 *     security:
 *       - internalToken: []
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
 *             $ref: '#/components/schemas/IDM_UpdateUserRequestDto'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_UserResponseDto'
 */
const updateUser = async (req, res, next) => {
  try {
    const data = await S.updateUser(req.params.userId, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/users/{userId}:
 *   get:
 *     tags:
 *       - IDM - Users
 *     summary: Get a user by ID (internal)
 *     security:
 *       - internalToken: []
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
 *               $ref: '#/components/schemas/IDM_UserResponseDto'
 */
const getUser = async (req, res, next) => {
  try {
    const data = await S.getUser(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/users:
 *   get:
 *     tags:
 *       - IDM - Users
 *     summary: List users (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IDM_UserResponseDto'
 */
const listUsers = async (req, res, next) => {
  try {
    const data = await S.getAllUsers();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  listUsers,
};