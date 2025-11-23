// src/services/clientMenu.service.js
const prisma = require("../db/prisma");
const {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
} = require("../dto/clientMenu.dto");

const createClientMenu = async (payload, coachId) => {
  const data = ClientMenuCreateRequestDto.parse(payload);

  return prisma.clientMenu.create({
    data: {
      name: data.name,
      clientId: data.clientId,
      coachId,
      dailyMenuTemplateId: data.dailyMenuTemplateId,
      structureJson: data.structureJson,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      notes: data.notes,
    },
    include: {
      dailyTemplate: true,
    },
  });
};

const listClientMenus = async (query) => {
  const includeInactive = query.includeInactive === "true";

  return prisma.clientMenu.findMany({
    where: {
      ...(query.clientId && { clientId: query.clientId }),
      ...(query.coachId && { coachId: query.coachId }),
      ...(!includeInactive && { isActive: true }),
    },
    include: {
      dailyTemplate: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getClientMenu = async (id) => {
  const menu = await prisma.clientMenu.findUnique({
    where: { id },
    include: {
      dailyTemplate: true,
    },
  });

  if (!menu) {
    const error = new Error("Client menu not found");
    error.status = 404;
    throw error;
  }

  return menu;
};

const updateClientMenu = async (id, payload) => {
  const data = ClientMenuUpdateRequestDto.parse(payload);

  const existing = await prisma.clientMenu.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error("Client menu not found");
    error.status = 404;
    throw error;
  }

  return prisma.clientMenu.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      structureJson:
        data.structureJson !== undefined
          ? data.structureJson
          : existing.structureJson,
      startDate:
        data.startDate !== undefined
          ? data.startDate
            ? new Date(data.startDate)
            : null
          : existing.startDate,
      endDate:
        data.endDate !== undefined
          ? data.endDate
            ? new Date(data.endDate)
            : null
          : existing.endDate,
      isActive: data.isActive ?? existing.isActive,
      notes: data.notes ?? existing.notes,
    },
    include: {
      dailyTemplate: true,
    },
  });
};

const deleteClientMenu = async (id) => {
  const existing = await prisma.clientMenu.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error("Client menu not found");
    error.status = 404;
    throw error;
  }

  return prisma.clientMenu.update({
    where: { id },
    data: { isActive: false },
  });
};

module.exports = {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
};
