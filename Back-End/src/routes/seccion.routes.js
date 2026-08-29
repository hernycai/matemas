import { Router } from "express";
import {
  getSecciones,
  getSeccionById,
  actualizarSeccion,
  crearSeccion,
  eliminarSeccion,
} from "../controllers/seccion.controller.js";
import {
  getEscenariosBySeccion,
  getEscenarioBySeccionAndId,
  actualizarEscenario,
  crearEscenario,
  eliminarEscenario,
} from "../controllers/escenario.controller.js";
import {
  getLeccionesBySeccion,
  crearLeccion,
  actualizarLeccion,
  eliminarLeccion,
} from "../controllers/leccion.controller.js";
import {
  getConsejosByEscenario,
  crearConsejo,
  actualizarConsejo,
  eliminarConsejo,
} from "../controllers/consejo.controller.js";

const router = Router();

router.get("/", getSecciones);
router.get("/:id", getSeccionById);
router.post("/", crearSeccion);
router.put("/:id", actualizarSeccion);
router.delete("/:id", eliminarSeccion);

router.get("/:seccionId/escenarios", getEscenariosBySeccion);
router.get("/:seccionId/escenarios/:escenarioId", getEscenarioBySeccionAndId);
router.post("/:seccionId/escenarios", crearEscenario);
router.put("/:seccionId/escenarios/:escenarioId", actualizarEscenario);
router.delete("/:seccionId/escenarios/:escenarioId", eliminarEscenario);

router.get("/:seccionId/lecciones", getLeccionesBySeccion);
router.post("/:seccionId/lecciones", crearLeccion);
router.put("/:seccionId/lecciones/:leccionId", actualizarLeccion);
router.delete("/:seccionId/lecciones/:leccionId", eliminarLeccion);

router.get(
  "/:seccionId/escenarios/:escenarioId/consejos",
  getConsejosByEscenario,
);
router.post("/:seccionId/escenarios/:escenarioId/consejos", crearConsejo);
router.put(
  "/:seccionId/escenarios/:escenarioId/consejos/:consejoId",
  actualizarConsejo,
);
router.delete(
  "/:seccionId/escenarios/:escenarioId/consejos/:consejoId",
  eliminarConsejo,
);

export default router;
