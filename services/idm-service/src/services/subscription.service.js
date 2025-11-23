const {prisma} = require('../db/prisma');
const {createSubscriptionDto, updateSubscriptionDto} = require('../dto/subscription.dto');
const {AppError} = require('../common/errors');

const normalizeDate = (value) => {
    if (value == null) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
};

const createSubscription = async (payload) => {
    const parsed = createSubscriptionDto.parse(payload);

    const user = await prisma.user.findUnique({where: {id: parsed.userId}});
    if (!user) throw new AppError(404, 'User not found');

    if (parsed.orgId != null) {
        const org = await prisma.organization.findUnique({where: {id: parsed.orgId}});
        if (!org) throw new AppError(404, 'Organization not found');
    }

    const startDate = parsed.startDate ?? new Date();

    const endDate =
        parsed.endDate === undefined
            ? new Date(startDate.getFullYear(), startDate.getMonth() + 2, startDate.getDate())
            : parsed.endDate;

    const existingActive = await prisma.subscription.findFirst({
        where: {
            userId: parsed.userId,
            status: {in: ['active', 'locked']},
            OR: [{endDate: null}, {endDate: {gte: startDate}}],
        },
    });

    if (existingActive) {
        throw new AppError(409, 'User already has an active subscription');
    }

    return prisma.subscription.create({
        data: {
            userId: parsed.userId,
            type: parsed.type,
            orgId: parsed.orgId ?? null,
            userType: parsed.userType,
            startDate,
            endDate,
            status: 'active',
        },
    });
};

const updateSubscription = async (id, payload) => {
    const parsed = updateSubscriptionDto.parse(payload);
    const existing = await prisma.subscription.findUnique({where: {id}});
    if (!existing) throw new AppError(404, 'Subscription not found');

    const nextType = parsed.type ?? existing.type;
    const nextOrgId = parsed.orgId === undefined ? existing.orgId : parsed.orgId;

    if (nextType === 'organization' && !nextOrgId) {
        throw new AppError(400, 'Organization subscriptions require an orgId');
    }

    if (parsed.orgId != null) {
        const org = await prisma.organization.findUnique({where: {id: parsed.orgId}});
        if (!org) throw new AppError(404, 'Organization not found');
    }

    const nextStartDate = parsed.startDate !== undefined
        ? normalizeDate(parsed.startDate) ?? existing.startDate
        : existing.startDate;
    const nextEndDate = parsed.endDate !== undefined
        ? normalizeDate(parsed.endDate)
        : existing.endDate;

    if (nextEndDate && nextStartDate && nextEndDate < nextStartDate) {
        throw new AppError(400, 'endDate must be after startDate');
    }

    const data = {};
    if (parsed.type !== undefined) data.type = parsed.type;
    if (parsed.startDate !== undefined) data.startDate = nextStartDate;
    if (parsed.endDate !== undefined) data.endDate = nextEndDate;
    if (parsed.status !== undefined) data.status = parsed.status;
    if (parsed.orgId !== undefined) data.orgId = parsed.orgId;
    if (parsed.userType !== undefined) data.userType = parsed.userType;

    if (Object.keys(data).length === 0) return existing;

    return prisma.subscription.update({where: {id}, data});
};

const deleteSubscription = async (id) => {
    try {
        await prisma.subscription.delete({where: {id}});
        return {deleted: true};
    } catch (err) {
        throw new AppError(404, 'Subscription not found');
    }
};

const getSubscription = async (id) => {
    const subscription = await prisma.subscription.findUnique({where: {id}});
    if (!subscription) throw new AppError(404, 'Subscription not found');
    return subscription;
};

const getAllSubscriptions = async () => prisma.subscription.findMany();

module.exports = { createSubscription, updateSubscription, deleteSubscription, getSubscription, getAllSubscriptions };
