const { z } = require('zod');
const I = require('../services/userInfo.service');
const { validateDto } = require('../common/validation');
const { upsertUserInfoDto } = require('../dto/userInfo.dto');

const userIdParamDto = z.object({ userId: z.string().uuid() }).strict();

const upsertUserInformation = async (req, res, next) => {
  try {
    const { userId } = validateDto(userIdParamDto, req.params);
    const payload = validateDto(upsertUserInfoDto, req.body);
    const data = await I.upsertUserInformation(userId, payload);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getUserInformation = async (req, res, next) => {
  try {
    const { userId } = validateDto(userIdParamDto, req.params);
    const data = await I.getUserInformation(userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const deleteUserInformation = async (req, res, next) => {
  try {
    const { userId } = validateDto(userIdParamDto, req.params);
    const data = await I.deleteUserInformation(userId);
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