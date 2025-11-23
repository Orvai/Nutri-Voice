const { Prisma } = require('@prisma/client');
const { prisma } = require('../db/prisma');
const { createOrgDto, updateOrgDto } = require('../dto/organization.dto');
const { AppError } = require('../common/errors');
const { normalizeCountryCode } = require('../common/country-code');

const handlePrismaError = (error) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError(404, 'Organization not found');
    }

    throw error;
};

const prepareOrganizationData = (data) => {
    if (data.country != null) {
        const normalizedCountry = normalizeCountryCode(data.country);
        if (!normalizedCountry) {
            throw new AppError(400, 'Invalid country code. Use ISO 3166-1 alpha-2 codes such as "US".');
        }

        return { ...data, country: normalizedCountry };
    }

    return data;
};

const createOrganization = async (payload) => {
    const parsed = createOrgDto.parse(payload);
    const data = prepareOrganizationData(parsed);
    return prisma.organization.create({ data });
};


const updateOrganization = async (orgId, payload) => {
    const parsed = updateOrgDto.parse(payload);
    const data = prepareOrganizationData(parsed);
    try {
        return await prisma.organization.update({ where: { id: orgId }, data });
    } catch (error) {
        handlePrismaError(error);
    }
};

const deleteOrganization = async (orgId) => {
    try {
        await prisma.organization.delete({ where: { id: orgId } });
        return { deleted: true };
    } catch (error) {
        handlePrismaError(error);
    }
};

const getOrganization = async (orgId) => {
    const organization = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!organization) throw new AppError(404, 'Organization not found');
    return organization;
};

const getOrganizations = async () => prisma.organization.findMany();

module.exports = {createOrganization, updateOrganization, deleteOrganization, getOrganization, getOrganizations};