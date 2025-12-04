const prisma = require("../db/prisma");

const listVitamins = () => {
  return prisma.vitaminMaster.findMany({
    orderBy: { name: "asc" }
  });
};

const createVitamin = async (data) => {
  return prisma.vitaminMaster.create({
    data: {
      name: data.name,
      description: data.description ?? null
    }
  });
};

module.exports = {
  listVitamins,
  createVitamin,
};
