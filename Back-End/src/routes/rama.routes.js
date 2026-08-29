import { Router } from "express";
import { getRamas } from "../controllers/rama.controller.js";

const router = Router();

router.get("/", getRamas);

export default router;
