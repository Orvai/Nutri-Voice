const I = require('../services/userInfo.service');

/**
 * @openapi
 * /internal/users/{userId}/info:
 *   put:
 *     tags:
 *       - IDM - User Info
 *     summary: Create or update user information (internal)
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
 *             $ref: '#/components/schemas/IDM_UpsertUserInfoRequestDto'
 *     responses:
 *       200:
 *         description: Upserted user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_UserInfoResponseDto'
 */
const upsertUserInformation = async (req, res, next) => {
  try {
    const data = await I.upsertUserInformation(req.params.userId, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/users/{userId}/info:
 *   get:
 *     tags:
 *       - IDM - User Info
 *     summary: Get user information (internal)
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
 *         description: User info details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_UserInfoResponseDto'
 */
const getUserInformation = async (req, res, next) => {
  try {
    const data = await I.getUserInformation(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/users/{userId}/info:
 *   delete:
 *     tags:
 *       - IDM - User Info
 *     summary: Delete user information (internal)
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
 *         description: Deleted user info record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_UserInfoResponseDto'
 */
const deleteUserInformation = async (req, res, next) => {
  try {
    const data = await I.deleteUserInformation(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  upsertUserInformation,
  getUserInformation,
  deleteUserInformation,
};