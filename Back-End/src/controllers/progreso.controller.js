import prisma from '../config/prisma.js';
import { generarFeedbackPedagogico } from '../services/gemini.service.js';
import { calcularRachaDiaria } from '../utils/racha.js';

export const registrarProgreso = async (req, res, next) => {
    const usuarioId = req.user.id;
    const { escenarioId, opcionId, respuestaUsuario } = req.body;

    console.log('========================================');
    console.log(`🚀 INICIO registrarProgreso`);
    console.log(`📝 Usuario: ${usuarioId}`);
    console.log(`📝 Escenario: ${escenarioId}`);
    console.log(`📝 OpcionId: ${opcionId || 'N/A'}`);
    console.log(`📝 RespuestaUsuario: ${respuestaUsuario || 'N/A'}`);
    console.log('========================================');

    try {
        let escenario;
        let esCorrecto;
        let puntosPosibles;
        let textoRespuestaUsuario;

        if (opcionId) {
            console.log('🔍 Buscando opción...');
            const opcion = await prisma.opcion.findUnique({
                where: { id: parseInt(opcionId) },
                include: { escenario: { include: { seccion: true } } }
            });

            if (!opcion || opcion.escenarioId !== parseInt(escenarioId)) {
                console.log('❌ Opción no válida');
                return res.status(404).json({ error: 'Opción no válida' });
            }

            escenario = opcion.escenario;
            esCorrecto = opcion.puntos > 0;
            puntosPosibles = opcion.puntos;
            textoRespuestaUsuario = opcion.texto;
            
            console.log(`✅ Opción encontrada: ID=${opcion.id}, Correcta=${esCorrecto}, Puntos=${puntosPosibles}`);
        } else {
            console.log('🔍 Buscando escenario numérico...');
            escenario = await prisma.escenario.findUnique({
                where: { id: parseInt(escenarioId) },
                include: { seccion: true }
            });

            if (!escenario || escenario.tipo !== 'numerico') {
                console.log('❌ Escenario no válido o no es numérico');
                return res.status(400).json({ error: 'Se requiere opcionId, o un escenario de tipo numerico junto con respuestaUsuario' });
            }

            esCorrecto = Number(respuestaUsuario) === Number(escenario.respuestaCorrecta);
            puntosPosibles = 10;
            textoRespuestaUsuario = String(respuestaUsuario);
            
            console.log(`✅ Escenario numérico: Correcta=${escenario.respuestaCorrecta}, Usuario=${respuestaUsuario}, Correcto=${esCorrecto}`);
        }

        console.log(`📊 Escenario: ID=${escenario.id}, Título="${escenario.titulo}", Tipo=${escenario.tipo}`);

        // Obtener usuario
        console.log('👤 Buscando usuario...');
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId }
        });

        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log(`👤 Usuario encontrado: Puntos=${usuario.puntos}, Tokens=${usuario.tokens}, Racha=${usuario.racha}`);

        const ahora = new Date();
        const { nuevaRacha, cambio: cambioRacha } = calcularRachaDiaria(
            usuario.racha,
            usuario.ultimaConexion,
            ahora,
        );
        console.log(`📅 Última conexión: ${usuario.ultimaConexion?.toISOString?.() || usuario.ultimaConexion || 'nunca'}`);
        console.log(`📅 Racha: ${usuario.racha} → ${nuevaRacha} (${cambioRacha})`);

        // Verificar progreso existente
        console.log('🔍 Verificando progreso existente...');
        const progresoExistente = await prisma.progreso.findFirst({
            where: { usuarioId, escenarioId: parseInt(escenarioId) }
        });

        const yaEstabaResuelto = progresoExistente?.resuelto || false;
        const puntosEscenario = (!yaEstabaResuelto && esCorrecto) ? puntosPosibles : 0;

        console.log(`📊 Progreso existente: ${progresoExistente ? 'SÍ' : 'NO'}`);
        console.log(`📊 Ya estaba resuelto: ${yaEstabaResuelto}`);
        console.log(`📊 Puntos del escenario: ${puntosEscenario} (${esCorrecto ? 'Correcto' : 'Incorrecto'})`);

        // Generar feedback
        let feedbackFinal = escenario.explicacion;
        if (!esCorrecto) {
            console.log('🤖 Generando feedback con Gemini...');
            try {
                feedbackFinal = await generarFeedbackPedagogico(
                    escenario.pregunta,
                    escenario.explicacion,
                    textoRespuestaUsuario
                );
                console.log('✅ Feedback generado exitosamente');
            } catch (error) {
                console.error('❌ Error generando feedback:', error.message);
                feedbackFinal = escenario.explicacion || 'Respuesta incorrecta. Intenta de nuevo.';
            }
        }

        // Guardar progreso
        console.log('💾 Guardando progreso...');
        if (progresoExistente) {
            await prisma.progreso.update({
                where: { id: progresoExistente.id },
                data: {
                    resuelto: yaEstabaResuelto || esCorrecto,
                    intentosFallidos: esCorrecto ? progresoExistente.intentosFallidos : { increment: 1 },
                    puntosObtenidos: yaEstabaResuelto ? progresoExistente.puntosObtenidos : puntosEscenario
                }
            });
            console.log(`✅ Progreso actualizado: ID=${progresoExistente.id}`);
        } else {
            await prisma.progreso.create({
                data: {
                    usuarioId,
                    escenarioId: parseInt(escenarioId),
                    puntosObtenidos: puntosEscenario,
                    resuelto: esCorrecto,
                    intentosFallidos: esCorrecto ? 0 : 1
                }
            });
            console.log(`✅ Progreso creado: Nuevo registro`);
        }

        // Actualizar usuario
        console.log(`💾 Actualizando usuario: +${puntosEscenario} puntos, racha=${nuevaRacha}`);
        await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                puntos: { increment: puntosEscenario },
                racha: nuevaRacha,
                ultimaConexion: ahora
            }
        });

        // Obtener progresos de la sección
        console.log(`🔍 Calculando progreso de sección ${escenario.seccionId}...`);
        const progresosSeccion = await prisma.progreso.findMany({
            where: {
                usuarioId,
                escenario: { seccionId: escenario.seccionId }
            }
        });

        const puntosActualesSeccion = progresosSeccion.reduce((acc, curr) => acc + curr.puntosObtenidos, 0);
        console.log(`📊 Puntos actuales en sección: ${puntosActualesSeccion}`);

        // Obtener escenarios de la sección
        const escenariosSeccion = await prisma.escenario.findMany({
            where: { seccionId: escenario.seccionId },
            include: { opciones: true }
        });

        // Calcular puntos máximos de la sección
        const puntosMaximosSeccion = escenariosSeccion.reduce((acc, esc) => {
            let maxPuntos = 0;
            
            if (esc.tipo === 'numerico') {
                maxPuntos = 10;
            } else {
                if (esc.opciones.length > 0) {
                    maxPuntos = Math.max(...esc.opciones.map(o => o.puntos));
                } else {
                    console.warn(`⚠️ Escenario ${esc.id} (${esc.titulo}) no tiene opciones`);
                    maxPuntos = 0;
                }
            }
            
            return acc + maxPuntos;
        }, 0);

        console.log(`📊 Puntos máximos en sección: ${puntosMaximosSeccion}`);
        console.log(`📊 Total escenarios en sección: ${escenariosSeccion.length}`);

        // Verificar aprobación
        const umbral = escenario.seccion?.umbralAprobacion || 0.66;
        const porcentajeActual = puntosMaximosSeccion > 0 
            ? Math.round((puntosActualesSeccion / puntosMaximosSeccion) * 100) 
            : 0;
        const seccionAprobada = puntosActualesSeccion >= (puntosMaximosSeccion * umbral);

        console.log(`🎯 Umbral: ${umbral * 100}%`);
        console.log(`🎯 Porcentaje actual: ${porcentajeActual}%`);
        console.log(`🎯 ¿Sección aprobada? ${seccionAprobada ? '✅ SÍ' : '❌ NO'}`);

        let ganoTokens = 0;
        let nombreSeccionNuevaAprobada = null;

        if (seccionAprobada) {
            console.log('🏆 ¡Sección aprobada! Verificando si ya estaba aprobada...');
            
            const yaAprobada = await prisma.seccionAprobada.findUnique({
                where: { usuarioId_seccionId: { usuarioId, seccionId: escenario.seccionId } }
            });

            if (!yaAprobada) {
                console.log('✅ Sección NO estaba aprobada, creando registro...');
                
                await prisma.seccionAprobada.create({
                    data: { usuarioId, seccionId: escenario.seccionId }
                });
                
                const seccion = await prisma.seccion.findUnique({ 
                    where: { id: escenario.seccionId } 
                });
                
                ganoTokens = seccion.puntosRecompensa;
                nombreSeccionNuevaAprobada = seccion.nombre;

                console.log(`🏆 Sección "${nombreSeccionNuevaAprobada}" aprobada!`);
                console.log(`💰 +${ganoTokens} tokens otorgados`);

                await prisma.usuario.update({
                    where: { id: usuarioId },
                    data: { tokens: { increment: ganoTokens } }
                });
            } else {
                console.log('ℹ️ Sección YA estaba aprobada, no se otorgan tokens nuevamente');
            }
        }

        // Obtener usuario final
        console.log('👤 Obteniendo usuario final...');
        const usuarioFinal = await prisma.usuario.findUnique({ 
            where: { id: usuarioId } 
        });

        console.log(`👤 Usuario final: Puntos=${usuarioFinal.puntos}, Tokens=${usuarioFinal.tokens}, Racha=${usuarioFinal.racha}`);

        // Calcular nuevos desbloqueos
        console.log('🔓 Calculando nuevos desbloqueos...');
        const todasDesbloqueadas = await prisma.seccion.findMany({
            where: { puntosRequeridos: { lte: usuarioFinal.puntos } }
        });

        const nuevosDesbloqueos = todasDesbloqueadas.filter(
            s => s.puntosRequeridos > (usuario.puntos || 0) && s.puntosRequeridos <= usuarioFinal.puntos
        );

        if (nuevosDesbloqueos.length > 0) {
            console.log(`🔓 Nuevos desbloqueos: ${nuevosDesbloqueos.map(s => s.nombre).join(', ')}`);
        } else {
            console.log('🔓 No hay nuevos desbloqueos');
        }

        console.log('========================================');
        console.log('✅ RESPONDIDA FINAL');
        console.log(`✅ esCorrecto: ${esCorrecto}`);
        console.log(`✅ puntosGanados: ${puntosEscenario}`);
        console.log(`✅ puntosTotalesAcademicos: ${usuarioFinal.puntos}`);
        console.log(`✅ tokensGanados: ${ganoTokens}`);
        console.log(`✅ tokensActuales: ${usuarioFinal.tokens}`);
        console.log(`✅ racha: ${usuarioFinal.racha}`);
        console.log(`✅ seccionAprobada: ${nombreSeccionNuevaAprobada || 'Ninguna'}`);
        console.log(`✅ nuevosDesbloqueos: ${nuevosDesbloqueos.map(s => s.nombre).join(', ') || 'Ninguno'}`);
        console.log('========================================');

        return res.status(201).json({
            esCorrecto,
            feedback: feedbackFinal,
            puntosGanados: puntosEscenario,
            puntosTotalesAcademicos: usuarioFinal.puntos,
            tokensActuales: usuarioFinal.tokens,
            tokensGanados: ganoTokens,
            racha: usuarioFinal.racha,
            seccionAprobada: nombreSeccionNuevaAprobada,
            nuevosDesbloqueos: nuevosDesbloqueos.map(s => s.nombre)
        });
    } catch (error) {
        console.error('========================================');
        console.error('❌ ERROR en registrarProgreso:');
        console.error(`❌ Mensaje: ${error.message}`);
        console.error(`❌ Stack: ${error.stack}`);
        console.error('========================================');
        next(error);
    }
};

export const getHistorialUsuario = async (req, res, next) => {
    const { uid } = req.params;
    console.log(`📝 getHistorialUsuario: Usuario ${uid}`);
    try {
        // IDOR: solo el propio usuario (o admin) puede ver historial
        const requesterId = req.user?.id;
        const rol = req.user?.rol;
        const esAdmin = rol === 'admin' || rol === 'superadmin';
        if (!esAdmin && requesterId !== uid) {
            return res.status(403).json({ error: 'No autorizado a ver el progreso de otro usuario' });
        }

        const historial = await prisma.progreso.findMany({
            where: { usuarioId: uid },
            include: {
                escenario: {
                    select: {
                        id: true,
                        titulo: true,
                        pregunta: true,
                        categoria: true,
                        tipo: true,
                        seccionId: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' }
        });
        console.log(`✅ Historial encontrado: ${historial.length} registros`);
        return res.json(historial);
    } catch (error) {
        console.error(`❌ Error en getHistorialUsuario: ${error.message}`);
        next(error);
    }
};