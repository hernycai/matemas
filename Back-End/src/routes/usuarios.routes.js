import { Router } from "express";
import {
  actualizarPerfil,
  registrarUsuario,
  eliminarUsuario,
  getUsuarios,
  loginUsuario,
  actualizarDesafioActual,
  getDesafioActual,
} from "../controllers/usuarios.controller.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";
import { rateLimitLogin } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.get("/", checkAuth, checkRole(["admin", "superadmin"]), getUsuarios);
router.post("/registro", registrarUsuario);
router.post("/login", rateLimitLogin, loginUsuario);
router.put("/perfil", checkAuth, actualizarPerfil);
router.delete("/eliminar", checkAuth, eliminarUsuario);
router.get("/desafio-actual", checkAuth, getDesafioActual);
router.patch("/desafio-actual", checkAuth, actualizarDesafioActual);

export default router;
