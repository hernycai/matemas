import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../../data');

const readCSV = (fileName) => {
    try {
        const filePath = path.join(DATA_PATH, fileName);
        if (!fs.existsSync(filePath)) return [];
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
            const values = line.split(','); // Corregido para manejar campos vacíos correctamente
            return headers.reduce((obj, header, index) => {
                let val = values[index]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                if (val?.startsWith('{') || val?.startsWith('[')) {
                    try { obj[header] = JSON.parse(val); } catch { obj[header] = val; }
                } else if (!isNaN(val) && val !== '' && !val.startsWith('user-') && !val.startsWith('admin-')) {
                    obj[header] = val.includes('.') ? parseFloat(val) : parseInt(val);
                } else {
                    obj[header] = val;
                }
                return obj;
            }, {});
        });
    } catch (e) {
        return [];
    }
};

const saveUsersToCSV = () => {
    try {
        const filePath = path.join(DATA_PATH, 'usuarios.csv');
        const headers = 'id,email,nombre,rol,puntos,racha,password,edad,genero,lugar,desafio,sentimiento,createdAt';
        const rows = db.usuario.map(u => [
            u.id,
            u.email,
            u.nombre,
            u.rol,
            u.puntos || 0,
            u.racha || 0,
            u.password,
            u.edad || '',
            u.genero || '',
            u.lugar || '',
            u.desafio || '',
            u.sentimiento || '',
            u.createdAt || new Date().toISOString()
        ].join(','));
        fs.writeFileSync(filePath, headers + '\n' + rows.join('\n'), 'utf-8');
    } catch (e) {
        console.error('❌ Error guardando usuarios.csv:', e);
    }
};

let db = {
    usuario: readCSV('usuarios.csv').map(u => ({ ...u, tokens: 0, ultimaConexion: new Date() })),
    seccion: readCSV('secciones.csv'),
    escenario: readCSV('escenarios.csv'),
    auditoria: readCSV('auditoria.csv'),
    progreso: [],
    seccionAprobada: [],
    opcion: [
        { id: 1, texto: "Respuesta de prueba (Incorrecta)", puntos: 0, escenarioId: 1 },
        { id: 2, texto: "42", puntos: 10, escenarioId: 1 }
    ]
};

const mockPrisma = {
    $queryRaw: async () => [{ 1: 1 }],
    usuario: {
        findUnique: async ({ where }) => {
            const emailSearch = where.email?.toLowerCase();
            return db.usuario.find(u =>
                u.id === where.id || u.email?.toLowerCase() === emailSearch
            );
        },
        upsert: async ({ where, create, update }) => {
            const emailSearch = where.email?.toLowerCase() || create.email?.toLowerCase();
            let idx = db.usuario.findIndex(u => u.id === where.id || u.email?.toLowerCase() === emailSearch);
            if (idx !== -1) {
                // Actualización selectiva: no pisar con valores nulos o indefinidos
                Object.keys(update).forEach(key => {
                    if (update[key] !== undefined && update[key] !== null && update[key] !== '') {
                        db.usuario[idx][key] = update[key];
                    }
                });
                saveUsersToCSV();
                return db.usuario[idx];
            }
            const newUser = {
                ...create,
                puntos: 0,
                tokens: 0,
                racha: 0,
                genero: create.genero || 'pendiente',
                lugar: create.lugar || 'pendiente',
                createdAt: new Date().toISOString()
            };
            db.usuario.push(newUser);
            saveUsersToCSV();
            return newUser;
        },
        update: async ({ where, data }) => {
            let idx = db.usuario.findIndex(u => u.id === where.id);
            if (idx === -1) return null;
            if (data.puntos?.increment) db.usuario[idx].puntos += data.puntos.increment;
            if (data.tokens?.increment) db.usuario[idx].tokens += data.tokens.increment;
            Object.keys(data).forEach(k => {
                // Solo actualizar si el valor no es nulo/indefinido (especialmente para password)
                if ((typeof data[k] !== 'object' || data[k] instanceof Date) && data[k] != null) {
                    db.usuario[idx][k] = data[k];
                }
            });
            saveUsersToCSV();
            return db.usuario[idx];
        },
        findMany: async () => db.usuario,
        count: async ({ where } = {}) => {
            let list = db.usuario;
            if (where?.rol) list = list.filter(u => u.rol === where.rol);
            if (where?.racha?.gt !== undefined) list = list.filter(u => u.racha > where.racha.gt);
            return list.length;
        },
        groupBy: async ({ by }) => {
            const field = by[0];
            const counts = {};
            db.usuario.filter(u => u.rol === 'usuario' && u[field] != null).forEach(u => {
                counts[u[field]] = (counts[u[field]] || 0) + 1;
            });
            return Object.entries(counts).map(([name, count]) => ({
                [field]: name,
                _count: { [field]: count }
            }));
        }
    },
    seccion: {
        findMany: async ({ where, include } = {}) => {
            return db.seccion.map(s => ({
                ...s,
                escenarios: include?.escenarios ? db.escenario.filter(e => e.seccionId === s.id) : []
            }));
        },
        findUnique: async ({ where }) => {
            const s = db.seccion.find(s => s.id === where.id);
            if (s) s.escenarios = db.escenario.filter(e => e.seccionId === s.id);
            return s;
        },
        create: async ({ data }) => {
            const newS = { id: db.seccion.length + 1, ...data };
            db.seccion.push(newS);
            return newS;
        },
        update: async ({ where, data }) => {
            let idx = db.seccion.findIndex(s => s.id === where.id);
            db.seccion[idx] = { ...db.seccion[idx], ...data };
            return db.seccion[idx];
        },
        delete: async ({ where }) => {
            db.seccion = db.seccion.filter(s => s.id !== where.id);
            return {};
        }
    },
    escenario: {
        findMany: async ({ where }) => db.escenario
            .filter(e => e.seccionId === where.seccionId)
            .map(e => ({ ...e, opciones: db.opcion.filter(o => o.escenarioId === e.id) })),

        findFirst: async ({ where }) => {
            const esc = db.escenario.find(e => e.id === where.id && e.seccionId === where.seccionId);
            if (esc) esc.opciones = db.opcion.filter(o => o.escenarioId === esc.id);
            return esc;
        },
        findUnique: async ({ where }) => db.escenario.find(e => e.id === where.id),
        create: async ({ data }) => {
            const newE = { id: db.escenario.length + 1, ...data };
            db.escenario.push(newE);
            return newE;
        },
        update: async ({ where, data }) => {
            let idx = db.escenario.findIndex(e => e.id === where.id);
            db.escenario[idx] = { ...db.escenario[idx], ...data };
            return db.escenario[idx];
        },
        delete: async ({ where }) => {
            db.escenario = db.escenario.filter(e => e.id !== where.id);
            return {};
        }
    },
    opcion: {
        findUnique: async ({ where }) => {
            const op = db.opcion.find(o => o.id === where.id);
            if (op) {
                op.escenario = { ...db.escenario.find(e => e.id === op.escenarioId) };
                op.escenario.seccion = db.seccion.find(s => s.id === op.escenario.seccionId);
            }
            return op;
        }
    },
    progreso: {
        findFirst: async ({ where }) => db.progreso.find(p => p.usuarioId === where.usuarioId && p.escenarioId === where.escenarioId),
        create: async ({ data }) => {
            const newP = { id: db.progreso.length + 1, ...data, updatedAt: new Date() };
            db.progreso.push(newP);
            return newP;
        },
        update: async ({ where, data }) => {
            let idx = db.progreso.findIndex(p => p.id === where.id);
            if (data.intentosFallidos?.increment) db.progreso[idx].intentosFallidos += data.intentosFallidos.increment;
            Object.keys(data).forEach(k => {
                if (typeof data[k] !== 'object') db.progreso[idx][k] = data[k];
            });
            return db.progreso[idx];
        },
        findMany: async ({ where } = {}) => {
            if (!where || !where.usuarioId) return db.progreso;
            return db.progreso.filter(p => p.usuarioId === where.usuarioId);
        }
    },
    seccionAprobada: {
        findUnique: async ({ where }) => db.seccionAprobada.find(sa => sa.usuarioId === where.usuarioId_seccionId.usuarioId && sa.seccionId === where.usuarioId_seccionId.seccionId),
        create: async ({ data }) => db.seccionAprobada.push(data)
    },
    auditoria: {
        findMany: async ({ include } = {}) => {
            return db.auditoria.map(log => ({
                ...log,
                usuario: include?.usuario ? db.usuario.find(u => u.id === log.usuarioId) : null
            }));
        },
        create: async ({ data }) => {
            const timestamp = new Date().toISOString();
            const newLog = {
                id: db.auditoria.length + 1,
                ...data,
                timestamp,
                detalles: typeof data.detalles === 'object' ? data.detalles : {}
            };
            db.auditoria.push(newLog);
            const AUDIT_PATH = path.join(DATA_PATH, 'auditoria.csv');

            const fileExists = fs.existsSync(AUDIT_PATH);
            const isEmpty = fileExists && fs.statSync(AUDIT_PATH).size === 0;
            if (!fileExists || isEmpty) {
                fs.writeFileSync(AUDIT_PATH, 'id,usuarioId,accion,entidad,entidadId,detalles,timestamp');
            }
            const csvLine = `\n${newLog.id},${newLog.usuarioId},${newLog.accion},${newLog.entidad},${newLog.entidadId || ''},"${JSON.stringify(newLog.detalles).replace(/"/g, '""')}",${timestamp}`;
            fs.appendFileSync(AUDIT_PATH, csvLine);
            return newLog;
        }
    }
};

export default mockPrisma;
