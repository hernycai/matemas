// Back-End/routes/ranking.routes.js
import { Router } from 'express';
import { 
    getRanking, 
    getPodio, 
    getMiEstadistica 
} from '../controllers/ranking.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(checkAuth);

// Obtener ranking completo
router.get('/', getRanking);

// Obtener podio (top 3)
router.get('/podio', getPodio);

// Obtener estadística del usuario actual
router.get('/mi-estadistica', getMiEstadistica);

export default router;