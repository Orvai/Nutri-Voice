// src/routes/mcp.routes.js
import { Router } from "express";
import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { runMcp } from "../services/mcp.service.js";

const r = Router();

r.post("/run", async (req, res, next) => {
  try {
    const input = RunMcpDto.parse(req.body);
    const result = await runMcp(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default r;
