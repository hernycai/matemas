import { Router } from 'express';
import { registrarProgreso, getHistorialUsuario } from '../controllers/progreso.controller.js';

const router = Router();

router.post('/', registrarProgreso);
router.get('/usuario/:uid', getHistorialUsuario);

export default router;
