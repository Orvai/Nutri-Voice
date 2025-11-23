const {prisma} = require('../db/prisma');
const {upsertUserInfoDto} = require('../dto/userInfo.dto');
const {AppError} = require('../common/errors');

const upsertUserInformation = async (userId, payload) => {
    const data = upsertUserInfoDto.parse(payload);
    const existing = await prisma.userInformation.findUnique({
        where: {userId},
    });
    if (existing) {
        return prisma.userInformation.update({
            where: {userId},
            data,
        });
    }
    return prisma.userInformation.create({
        data: {userId, ...data},
    });
};

const getUserInformation = async (userId) => {
    const info = await prisma.userInformation.findUnique({
        where: {userId},
    });
    if (!info) throw new AppError(404, 'User info not found');
    return info;
};

const deleteUserInformation = async (userId) => {
    const info = await prisma.userInformation.findUnique({
        where: {userId},
    });
    if (!info) throw new AppError(404, 'User info not found');

    await prisma.userInformation.delete({where: {userId}});
    return {deleted: true};
};

module.exports = { upsertUserInformation, getUserInformation, deleteUserInformation };