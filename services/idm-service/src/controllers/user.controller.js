const { z } = require('zod');
const S = require('../services/user.service');
const { validateDto } = require('../common/validation');
const { createUserDto, updateUserDto } = require('../dto/user.dto');

const userIdParamDto = z.object({ userId: z.string().uuid() }).strict();

const createUser = async (req, res, next) => {
  try {
    const payload = validateDto(createUserDto, req.body);
    const data = await S.createUser(payload);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = validateDto(userIdParamDto, req.params);
    const payload = validateDto(updateUserDto, req.body);
    const data = await S.updateUser(userId, payload);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = validateDto(userIdParamDto, req.params);
    const data = await S.getUser(userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const data = await S.getAllUsers();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getUserByPhone = async (req, res, next) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: "phone is required" });
    }

    const user = await UsersService.findByPhone(phone);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  listUsers,
  getUserByPhone,
};