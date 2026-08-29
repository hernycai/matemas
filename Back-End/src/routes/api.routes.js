import { Router } from "express";
import seccionRoutes from "./seccion.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import progresoRoutes from "./progreso.routes.js";
import ramaRoutes from "./rama.routes.js";
import rankingRoutes from "./ranking.routes.js";
import { getLogs } from "../controllers/auditoria.controller.js";
import * as admin from "../controllers/admin.controller.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";
import { auditMiddleware } from "../middlewares/audit.middleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.use("/secciones", checkAuth, auditMiddleware, seccionRoutes);
router.use("/usuarios", auditMiddleware, usuariosRoutes);
router.use("/ramas", checkAuth, auditMiddleware, ramaRoutes);
router.use("/progreso", checkAuth, auditMiddleware, progresoRoutes);
router.use("/ranking", checkAuth, auditMiddleware, rankingRoutes);
router.get(
  "/logs",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  getLogs,
);

// Admin-BE: Centro de Mando Brutalista
router.get(
  "/admin-be/main",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  admin.getAdminMain,
);
router.get(
  "/admin-be/checkup",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  admin.getCheckupStatus,
);
router.get(
  "/admin-be/analytics",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  admin.getAnalyticsData,
);
router.get(
  "/admin-be/upsert_manual",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  admin.upsertManual,
);
router.post(
  "/admin-be/test-feedback",
  checkAuth,
  checkRole(["admin", "superadmin"]),
  admin.testFeedback,
);

export default router;
