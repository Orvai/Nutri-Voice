// gateway/src/controllers/authProfile.controller.js
import * as idm from "../adapters/idm.adapter.js";
import { UserProfileDto } from "../dtos/user.dto.js";

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get authenticated user's full profile
 *     description: Returns combined user + userInfo for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful user profile retrieval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 */
export async function getMe(req, res, next) {
  try {
    const userId = req.user.userId;

    const user = await idm.getUser(userId);

    const info = await idm.getUserInfo(userId);

    const profile = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? null,
      imageUrl: info?.imageUrl ?? null,
    };

    // Validate (safety)
    const validated = UserProfileDto.parse(profile);

    return res.json({ user: validated });
  } catch (err) {
    next(err);
  }
}
