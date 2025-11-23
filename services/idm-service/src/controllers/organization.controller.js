const O = require('../services/organization.service');

/**
 * Create a new organization.
 *
 * This endpoint allows administrators to create a new organization in the
 * system. The request body should contain the organization details such
 * as name and domain, along with optional metadata like address, country,
 * industry, contact information, and size as defined by the
 * industry, contact information, and size as defined by the
 * When supplying a country, use the ISO 3166-1 alpha-2 code (for example, "US").
 *
 * @openapi
 * /api/organizations:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: Create organization
 *     description: Creates a new organization. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationInput'
 *     responses:
 *       200:
 *         description: Organization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 * 
 */
const createOrganization = async (req, res, next) => {
  try {
    res.json(await O.createOrganization(req.body));
  } catch (e) { next(e); }
};

/**
 * Update an existing organization.
 *
 * Modify the details of an organization identified by `orgId`. Only
 * provided fields (name, domain, address, country, industry, contact
 * details, or size) will be updated; unspecified fields remain unchanged.
 * Country values must use ISO 3166-1 alpha-2 codes such as "US".
 * Requires authentication.
 *
 * @openapi
 * /api/organizations/{orgId}:
 *   patch:
 *     tags:
 *       - Organizations
 *     summary: Update organization
 *     description: Updates an existing organization's details. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrganizationInput'
 *     responses:
 *       200:
 *         description: Organization updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Organization not found
 */
const updateOrganization = async (req, res, next) => {
  try {
    res.json(await O.updateOrganization(req.params.orgId, req.body));
  } catch (e) { next(e); }
};

/**
 * Delete an organization.
 *
 * Permanently removes an organization from the system based on its ID.
 * Requires authentication.
 *
 * @openapi
 * /api/organizations/{orgId}:
 *   delete:
 *     tags:
 *       - Organizations
 *     summary: Delete organization
 *     description: Deletes an organization by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *               required: [deleted]
 *       404:
 *         description: Organization not found
 */
const deleteOrganization = async (req, res, next) => {
  try {
    res.json(await O.deleteOrganization(req.params.orgId));
  } catch (e) { next(e); }
};

/**
 * Retrieve a single organization.
 *
 * Fetches a single organization by its ID, including optional metadata
 * fields when available. Requires authentication.
 *  
 * @openapi
 * /api/organizations/{orgId}:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Get organization
 *     description: Retrieves details of an organization by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
const getOrganization = async (req, res, next) => {
  try {
    res.json(await O.getOrganization(req.params.orgId));
  } catch (e) { next(e); }
};

/**
 * List all organizations.
 *
 * Returns a list of all organizations. Requires authentication.
 *
 * @openapi
 * /api/organizations:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: List organizations
 *     description: Returns all organizations. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
const getOrganizations = async (req, res, next) => {
  try {
    res.json(await O.getOrganizations());
  } catch (e) { next(e); }
};


module.exports = {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
};