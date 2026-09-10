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
        if (lines.length === 0) return [];
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
            const values = line.split(',');
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
    seccion: readCSV('secciones.csv').map((s, idx) => ({
        ...s,
        ramaId: s.ramaId || (idx < 2 ? 1 : idx < 4 ? 2 : 3)
    })),
    rama: [
        { id: 1, nombre: "Economía Doméstica y Cotidiana", descripcion: "Gastos, presupuestos y compras diarias", orden: 1, activo: true },
        { id: 2, nombre: "Comercio Minorista y Construcción", descripcion: "Medidas, stock y proporciones", orden: 2, activo: true },
        { id: 3, nombre: "Logística y Finanzas Prácticas", descripcion: "Intereses, distancias y ahorro", orden: 3, activo: true },
    ],
    escenario: readCSV('escenarios.csv'),
    auditoria: readCSV('auditoria.csv'),
    progreso: [],
    seccionAprobada: [],
    opcion: [
        { id: 1, texto: "Respuesta de prueba (Incorrecta)", puntos: 0, escenarioId: 1 },
        { id: 2, texto: "42", puntos: 10, escenarioId: 1 }
    ],
    recurso: [],
    insignia: [],
    leccion: readCSV('lecciones.example.csv'),
    consejo: []
};

const mockPrisma = {
    $queryRaw: async () => [{ 1: 1 }],
    $transaction: async (operations) => {
        if (Array.isArray(operations)) {
            const results = [];
            for (const op of operations) {
                results.push(await op);
            }
            return results;
        } else if (typeof operations === 'function') {
            return await operations(mockPrisma);
        }
        return [];
    },
    usuario: {
        findUnique: async ({ where }) => {
            const emailSearch = where?.email?.toLowerCase();
            const u = db.usuario.find(u =>
                (where.id && u.id === where.id) || (emailSearch && u.email?.toLowerCase() === emailSearch)
            );
            if (!u) return null;
            return {
                ...u,
                _count: {
                    seccionesAprobadas: db.seccionAprobada?.filter(sa => sa.usuarioId === u.id).length || 0,
                    progreso: db.progreso?.filter(p => p.usuarioId === u.id && p.resuelto).length || 0
                }
            };
        },
        findFirst: async ({ where } = {}) => {
            if (!where) return db.usuario[0] || null;
            return db.usuario.find(u => {
                if (where.email) {
                    const emailVal = typeof where.email === 'string' ? where.email : where.email.equals;
                    if (emailVal && u.email?.toLowerCase() !== emailVal.toLowerCase()) return false;
                }
                if (where.NOT?.id && u.id === where.NOT.id) return false;
                if (where.id && u.id !== where.id) return false;
                return true;
            }) || null;
        },
        upsert: async ({ where, create, update }) => {
            const emailSearch = where?.email?.toLowerCase() || create?.email?.toLowerCase();
            let idx = db.usuario.findIndex(u => (where?.id && u.id === where.id) || (emailSearch && u.email?.toLowerCase() === emailSearch));
            if (idx !== -1) {
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
                genero: create?.genero || 'pendiente',
                lugar: create?.lugar || 'pendiente',
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
                if ((typeof data[k] !== 'object' || data[k] instanceof Date) && data[k] != null) {
                    db.usuario[idx][k] = data[k];
                }
            });
            saveUsersToCSV();
            return db.usuario[idx];
        },
        findMany: async ({ where, orderBy, take } = {}) => {
            let list = [...db.usuario];
            if (where?.nombre?.not !== undefined) {
                list = list.filter(u => u.nombre != null);
            }
            if (orderBy && Array.isArray(orderBy)) {
                list.sort((a, b) => {
                    for (const rule of orderBy) {
                        const [field, dir] = Object.entries(rule)[0];
                        const valA = a[field] ?? 0;
                        const valB = b[field] ?? 0;
                        if (valA !== valB) {
                            return dir === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
                        }
                    }
                    return 0;
                });
            }
            if (take) {
                list = list.slice(0, take);
            }
            return list.map(u => ({
                ...u,
                _count: {
                    seccionesAprobadas: db.seccionAprobada?.filter(sa => sa.usuarioId === u.id).length || 0,
                    progreso: db.progreso?.filter(p => p.usuarioId === u.id && p.resuelto).length || 0
                }
            }));
        },
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
        },
        delete: async ({ where }) => {
            const idx = db.usuario.findIndex(u => u.id === where.id);
            let deleted = null;
            if (idx !== -1) {
                deleted = db.usuario.splice(idx, 1)[0];
                saveUsersToCSV();
            }
            return deleted || {};
        }
    },
    seccion: {
        findMany: async ({ where, include } = {}) => {
            let list = db.seccion.map(s => ({
                ...s,
                rama: db.rama.find(r => r.id === s.ramaId) || null,
                escenarios: include?.escenarios ? db.escenario.filter(e => e.seccionId === s.id) : []
            }));
            if (where?.ramaId) {
                list = list.filter(s => s.ramaId === where.ramaId);
            }
            return list;
        },
        findUnique: async ({ where, include } = {}) => {
            const s = db.seccion.find(s => s.id === where.id);
            if (!s) return null;
            const res = { ...s };
            if (include?.escenarios) res.escenarios = db.escenario.filter(e => e.seccionId === s.id);
            if (include?.rama) res.rama = db.rama.find(r => r.id === s.ramaId) || null;
            return res;
        },
        count: async ({ where } = {}) => {
            let list = db.seccion;
            if (where?.ramaId) list = list.filter(s => s.ramaId === where.ramaId);
            return list.length;
        },
        create: async ({ data }) => {
            const newS = { id: db.seccion.length + 1, ...data };
            db.seccion.push(newS);
            return newS;
        },
        update: async ({ where, data }) => {
            let idx = db.seccion.findIndex(s => s.id === where.id);
            if (idx === -1) return null;
            db.seccion[idx] = { ...db.seccion[idx], ...data };
            return db.seccion[idx];
        },
        delete: async ({ where }) => {
            db.seccion = db.seccion.filter(s => s.id !== where.id);
            return {};
        }
    },
    rama: {
        findMany: async ({ where, include } = {}) => {
            let list = [...db.rama];
            if (where?.activo !== undefined) {
                list = list.filter(r => r.activo === where.activo);
            }
            if (include?.secciones) {
                list = list.map(r => ({
                    ...r,
                    secciones: db.seccion
                        .filter(s => s.ramaId === r.id)
                        .map(s => ({
                            id: s.id,
                            nombre: s.nombre,
                            grado: s.grado,
                            puntosRecompensa: s.puntosRecompensa || 0
                        }))
                }));
            }
            return list;
        },
        findUnique: async ({ where }) => {
            return db.rama.find(r => r.id === where.id) || null;
        },
        findFirst: async ({ where } = {}) => {
            if (!where) return db.rama[0] || null;
            return db.rama.find(r => where.id === undefined || r.id === where.id) || null;
        }
    },
    escenario: {
        findMany: async ({ where } = {}) => {
            let list = db.escenario;
            if (where?.seccionId) list = list.filter(e => e.seccionId === where.seccionId);
            return list.map(e => ({ ...e, opciones: db.opcion.filter(o => o.escenarioId === e.id) }));
        },
        findFirst: async ({ where } = {}) => {
            const esc = db.escenario.find(e => (!where.id || e.id === where.id) && (!where.seccionId || e.seccionId === where.seccionId));
            if (esc) esc.opciones = db.opcion.filter(o => o.escenarioId === esc.id);
            return esc || null;
        },
        findUnique: async ({ where }) => {
            const esc = db.escenario.find(e => e.id === where.id);
            if (esc) esc.opciones = db.opcion.filter(o => o.escenarioId === esc.id);
            return esc || null;
        },
        count: async ({ where } = {}) => {
            let list = db.escenario;
            if (where?.seccionId) list = list.filter(e => e.seccionId === where.seccionId);
            return list.length;
        },
        create: async ({ data }) => {
            const newE = { id: db.escenario.length + 1, ...data };
            db.escenario.push(newE);
            return newE;
        },
        update: async ({ where, data }) => {
            let idx = db.escenario.findIndex(e => e.id === where.id);
            if (idx === -1) return null;
            db.escenario[idx] = { ...db.escenario[idx], ...data };
            return db.escenario[idx];
        },
        delete: async ({ where }) => {
            db.escenario = db.escenario.filter(e => e.id !== where.id);
            return {};
        }
    },
    opcion: {
        findMany: async ({ where } = {}) => {
            let list = db.opcion;
            if (where?.escenarioId) list = list.filter(o => o.escenarioId === where.escenarioId);
            return list;
        },
        findUnique: async ({ where }) => {
            let op = db.opcion.find(o => o.id === where.id);
            if (!op && where.id) {
                const idNum = parseInt(where.id);
                const esAcierto = idNum % 10 === 1 || idNum === 2;
                op = {
                    id: idNum,
                    texto: `Opción ${idNum}`,
                    puntos: esAcierto ? 10 : 0,
                    escenarioId: Math.floor(idNum / 10) || 1
                };
            }
            if (op) {
                const esc = db.escenario.find(e => e.id === op.escenarioId) || {
                    id: op.escenarioId,
                    titulo: `Escenario ${op.escenarioId}`,
                    pregunta: "¿Cuál es el resultado correcto?",
                    explicacion: "Multiplicá o dividí según la proporción indicada para obtener el resultado exacto.",
                    tipo: 'choice',
                    seccionId: 1
                };
                op.escenario = { ...esc };
                op.escenario.seccion = db.seccion.find(s => s.id === op.escenario.seccionId) || { id: 1, nombre: 'Matemática Cotidiana' };
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
            if (idx === -1) return null;
            if (data.intentosFallidos?.increment) db.progreso[idx].intentosFallidos += data.intentosFallidos.increment;
            Object.keys(data).forEach(k => {
                if (typeof data[k] !== 'object') db.progreso[idx][k] = data[k];
            });
            return db.progreso[idx];
        },
        findMany: async ({ where } = {}) => {
            if (!where || !where.usuarioId) return db.progreso;
            return db.progreso.filter(p => p.usuarioId === where.usuarioId);
        },
        deleteMany: async ({ where } = {}) => {
            const initial = db.progreso.length;
            if (!where) {
                db.progreso = [];
                return { count: initial };
            }
            db.progreso = db.progreso.filter(p => {
                if (where.usuarioId && p.usuarioId === where.usuarioId) return false;
                return true;
            });
            return { count: initial - db.progreso.length };
        }
    },
    seccionAprobada: {
        findUnique: async ({ where }) => {
            if (!where) return null;
            if (where.usuarioId_seccionId) {
                return db.seccionAprobada.find(
                    sa => sa.usuarioId === where.usuarioId_seccionId.usuarioId &&
                          sa.seccionId === where.usuarioId_seccionId.seccionId
                ) || null;
            }
            return db.seccionAprobada.find(sa => 
                (where.usuarioId === undefined || sa.usuarioId === where.usuarioId) &&
                (where.seccionId === undefined || sa.seccionId === where.seccionId)
            ) || null;
        },
        findFirst: async ({ where } = {}) => {
            if (!where) return db.seccionAprobada[0] || null;
            return db.seccionAprobada.find(sa => 
                (where.usuarioId === undefined || sa.usuarioId === where.usuarioId) &&
                (where.seccionId === undefined || sa.seccionId === where.seccionId)
            ) || null;
        },
        findMany: async ({ where, select } = {}) => {
            let list = [...db.seccionAprobada];
            if (where?.usuarioId) {
                list = list.filter(sa => sa.usuarioId === where.usuarioId);
            }
            if (where?.seccionId) {
                list = list.filter(sa => sa.seccionId === where.seccionId);
            }
            if (select) {
                return list.map(sa => {
                    const res = {};
                    Object.keys(select).forEach(key => {
                        if (select[key]) res[key] = sa[key];
                    });
                    return res;
                });
            }
            return list;
        },
        count: async ({ where } = {}) => {
            let list = [...db.seccionAprobada];
            if (where?.usuarioId) {
                list = list.filter(sa => sa.usuarioId === where.usuarioId);
            }
            if (where?.seccionId) {
                list = list.filter(sa => sa.seccionId === where.seccionId);
            }
            if (where?.seccion?.ramaId) {
                const seccionesDeRama = new Set(db.seccion.filter(s => s.ramaId === where.seccion.ramaId).map(s => s.id));
                list = list.filter(sa => seccionesDeRama.has(sa.seccionId));
            }
            return list.length;
        },
        create: async ({ data }) => {
            const exists = db.seccionAprobada.find(sa => sa.usuarioId === data.usuarioId && sa.seccionId === data.seccionId);
            if (!exists) {
                db.seccionAprobada.push(data);
            }
            return data;
        },
        deleteMany: async ({ where } = {}) => {
            const initialCount = db.seccionAprobada.length;
            if (!where) {
                db.seccionAprobada = [];
                return { count: initialCount };
            }
            db.seccionAprobada = db.seccionAprobada.filter(sa => {
                if (where.usuarioId && sa.usuarioId === where.usuarioId) return false;
                if (where.seccionId && sa.seccionId === where.seccionId) return false;
                return true;
            });
            return { count: initialCount - db.seccionAprobada.length };
        },
        delete: async ({ where } = {}) => {
            if (where?.usuarioId_seccionId) {
                db.seccionAprobada = db.seccionAprobada.filter(sa =>
                    !(sa.usuarioId === where.usuarioId_seccionId.usuarioId && sa.seccionId === where.usuarioId_seccionId.seccionId)
                );
            }
            return {};
        }
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
        },
        deleteMany: async ({ where } = {}) => {
            const initial = db.auditoria.length;
            if (!where) {
                db.auditoria = [];
                return { count: initial };
            }
            db.auditoria = db.auditoria.filter(a => {
                if (where.usuarioId && a.usuarioId === where.usuarioId) return false;
                return true;
            });
            return { count: initial - db.auditoria.length };
        }
    },
    recurso: {
        findMany: async () => [],
        deleteMany: async () => ({ count: 0 }),
        findUnique: async () => null,
        create: async ({ data }) => data,
    },
    insignia: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async ({ data }) => data,
    },
    leccion: {
        findMany: async ({ where } = {}) => {
            const lecciones = readCSV('lecciones.example.csv');
            if (where?.seccionId) {
                return lecciones.filter(l => l.seccionId === where.seccionId);
            }
            return lecciones;
        },
        findUnique: async ({ where }) => {
            const lecciones = readCSV('lecciones.example.csv');
            return lecciones.find(l => l.id === where.id) || null;
        },
        create: async ({ data }) => ({ id: 1, ...data }),
        update: async ({ where, data }) => ({ ...data, id: where.id }),
        delete: async () => ({})
    },
    consejo: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async ({ data }) => ({ id: 1, ...data }),
        update: async ({ where, data }) => ({ ...data, id: where.id }),
        delete: async () => ({})
    }
};

export default mockPrisma;
