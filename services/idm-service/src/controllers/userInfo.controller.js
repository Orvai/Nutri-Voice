const I = require('../services/userInfo.service');

/**
 * Upsert (create or update) user information.
 *
 * This endpoint allows clients to create or update the profile information
 * associated with a user. If the user does not already have an info
 * record, a new one will be created; otherwise, the existing record
 * will be updated. The request body must follow the
 * `UserInfoInput` schema. Requires authentication.
 *
 * @openapi
 * /api/users/{userId}/info:
 *   put:
 *     tags:
 *       - UserInfo
 *     summary: Upsert user information
 *     description: Creates or updates user information for the given user ID. Requires authentication.
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
 *             $ref: '#/components/schemas/UserInfoInput'
 *     responses:
 *       200:
 *         description: User information upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 *       400:
 *         description: Validation error
 */
const upsertUserInformation = async (req, res, next) => {
  try {
    res.json(await I.upsertUserInformation(req.params.userId, req.body));
  } catch (e) { next(e); }
};

/**
 * Retrieve user information.
 *
 * Fetches the profile information associated with a given user ID. If the
 * user has not provided any information, the service will return a 404
 * error. Requires authentication.
 *
 * @openapi
 * /api/users/{userId}/info:
 *   get:
 *     tags:
 *       - UserInfo
 *     summary: Get user information
 *     description: Retrieves user information for the specified user ID. Requires authentication.
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
 *         description: User information details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 *       404:
 *         description: User information not found
 */
const getUserInformation = async (req, res, next) => {
  try {
    res.json(await I.getUserInformation(req.params.userId));
  } catch (e) { next(e); }
};

/**
 * Delete user information.
 *
 * Removes the profile information for the specified user. If no info
 * exists for the user, a 404 error is returned. Requires authentication.
 *
 * @openapi
 * /api/users/{userId}/info:
 *   delete:
 *     tags:
 *       - UserInfo
 *     summary: Delete user information
 *     description: Deletes user information for the given user ID. Requires authentication.
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
 *         description: User information deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *               required: [deleted]
 *       404:
 *         description: User information not found
 */
const deleteUserInformation = async (req, res, next) => {
  try {
    res.json(await I.deleteUserInformation(req.params.userId));
  } catch (e) { next(e); }
};

module.exports = {
  upsertUserInformation,
  getUserInformation,
  deleteUserInformation,
};