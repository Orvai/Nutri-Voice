// gateway/src/controllers/clients.controller.js
import * as idm from "../adapters/idm.adapter.js";

export async function listClients(req, res, next) {
  try {
    const data = await idm.listClients();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
