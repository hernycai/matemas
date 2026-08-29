import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import logo from '../../../Back-End/src/assets/logonodo.png';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const DebugDB = () => {
    const { profile, user, loading, refreshProfile } = useAuth();
    const API_BASE = api.defaults.baseURL;
    const [logs, setLogs] = useState([`SYS_READY> Nodo *Activo*`]);
    const [stats, setStats] = useState({ totalUsuarios: '--', usuariosActivos: '--', latencia: '--', source: 'IDLE', charts: null });
    const [modal, setModal] = useState({ open: false, type: '' });
    const [pautaTarget, setPautaTarget] = useState('secciones');
    const [activeGraph, setActiveGraph] = useState(null);
    const [key, setKey] = useState(localStorage.getItem('admin_key') || '');

    const addLog = (txt) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${txt}`]);
    };

    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el spinner

    const exec = async (cmd) => {
        setIsLoading(true); // Activar spinner
        addLog(`PETICIÓN_NÚCLEO: ${cmd.toUpperCase()}`);

        let endpoint = `/admin-be/${cmd}`;
        let method = 'get';

        if (cmd === 'audit') endpoint = `/logs?limit=5`;
        if (cmd === 'usuarios' || cmd === 'secciones') endpoint = `/${cmd}`;
        if (cmd === 'checkup') endpoint = `/admin-be/checkup`;

        // Mapeo explícito para evitar el 404 de /feedback
        if (cmd === 'test-feedback' || cmd === 'feedback') {
            endpoint = `/admin-be/test-feedback`;
            method = 'post';
        }

        try {
            const res = method === 'post'
                ? await api.post(endpoint, { dificultad: 'media' })
                : await api.get(endpoint);
            const data = res.data;

            addLog(`RESPUESTA_NÚCLEO: ${JSON.stringify(data, null, 2)}`);

            if (cmd === 'analytics' || cmd === 'checkup') {
                setStats(prev => ({
                    ...prev,
                    totalUsuarios: data.ST?.U_TOTAL ?? prev.totalUsuarios,
                    usuariosActivos: data.ST?.U_ACT ?? prev.usuariosActivos,
                    latencia: data.ia?.LAT || prev.latencia,
                    source: data.nucleo?.SOURCE || prev.source,
                    charts: data.CH
                }));
            }
        } catch (err) {
            const status = err.response?.status;
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            addLog(`⚠️ ERROR_CRÍTICO en ${err.config?.url}: ${errorMsg} (Status: ${status || 'NET_FAIL'})`);

            if (status === 403) addLog("Tu usuario no tiene rol 'admin' o 'superadmin' en la base de datos.");
            if (status === 401) addLog("El token de Supabase no llegó o expiró. Re-logueate.");
        } finally {
            setIsLoading(false); // Desactivar spinner
        }
    };

    useEffect(() => {
        addLog("SYS_STANDBY> Ejecutá ESTADO para verificar integridad.");
    }, []);

    const getPermisoLabel = () => {
        if (loading) return 'CARGANDO';
        if (!profile) return 'INICIAR SESIÓN';
        if (profile.rol === 'superadmin') return 'ACCESO COMPLETO';
        if (profile.rol === 'admin') return 'ACCESO';
        return 'SIN ACCESO';
    };

    const MarqueeName = ({ name }) => (
        <div style={{ width: '120px', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
            <div className={name.length > 12 ? 'marquee-text' : ''}>
                {name}
            </div>
        </div>
    );

    const Spinner = () => (
        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
    );

    const BrutalButton = ({ onClick, children, small = false, tooltip }) => (
        <button
            onClick={onClick}
            className={tooltip ? "has-tooltip" : ""}
            data-tooltip={tooltip}
            style={{
                position: 'relative', background: '#1a1a1a', color: '#ffb300', border: 'none',
                padding: small ? '4px 8px' : '12px', cursor: 'pointer',
                fontFamily: 'Fira Code, monospace', fontWeight: 'bold',
                fontSize: small ? '0.75em' : '1em', transition: 'all 0.3s ease',
                boxShadow: small ? '2px 2px 0px #000' : '4px 4px 0px #000',
                outline: 'none'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ffb300'; e.currentTarget.style.color = '#1a1a1a'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#ffb300'; }}
        >
            {children}
        </button>
    );

    return (
        <div style={{ background: '#121212', minHeight: '100vh', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ color: '#ffb300', padding: '20px', fontFamily: 'Fira Code, monospace', width: '100%', maxWidth: '800px' }}>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-20%); }
                    100% { transform: translateX(0); }
                }
                .marquee-text {
                    display: inline-block;
                    padding-left: 5px;
                    animation: marquee 10s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .header-container {
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .identity-section {
                    padding-left: 85px;
                    gap: 20px;
                }
                .text-block {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 5px;
                    flex: 1;
                }
                @media (max-width: 768px) {
                    .identity-section {
                        padding-left: 5% !important;
                        justify-content: center !important;
                        width: 100% !important;
                        gap: 5% !important;
                    }
                    .text-block {
                        align-items: center !important;
                        text-align: center;
                    }
                    .info-block {
                        width: 100% !important;
                        border-left: none !important;
                        border-top: 1px solid #444;
                        padding-top: 15px;
                        padding-left: 0px !important;
                    }
                }
                .has-tooltip:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffb300;
                    color: #121212;
                    padding: 5px 10px;
                    font-size: 11px;
                    font-weight: bold;
                    border: 1px solid #000;
                    box-shadow: 3px 3px 0px #000;
                    white-space: nowrap;
                    z-index: 9999;
                    pointer-events: none;
                }
            `}</style>

            {/* [IO] Cabecera de Identidad */}
            <div className="header-container" style={{ padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', background: '#1a1a1a', boxShadow: '5px 5px 0px #000' }}>
                <div className="identity-section" style={{ display: 'flex', alignItems: 'center', minWidth: '280px' }}>
                    <img src={logo} alt="Logo Nodo" style={{ width: '90px', height: '90px', objectFit: 'contain', padding: '2px' }} />
                    <div className="text-block">
                        <span style={{ fontSize: '1.5em', fontWeight: 'bold', lineHeight: '1.2', whiteSpace: 'nowrap' }}>·: MATE+ :·</span>
                        <span style={{ fontSize: '0.9em', fontWeight: 'bold', lineHeight: '1.2', whiteSpace: 'nowrap' }}>··: NODO ADMIN :··</span>
                        {profile === null && !loading && (
                            <div style={{ marginTop: '10px' }}>
                                <BrutalButton small onClick={refreshProfile}>[ RE-VINCULAR_PERFIL ]</BrutalButton>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bloque de Identidad de Ancho Fijo */}
                <div className="info-block" style={{ width: '280px', borderLeft: '1px solid #444', paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className="has-tooltip" data-tooltip="Estado de conexión del servidor central" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                        <span>NÚCLEO:</span>
                        <span style={{ color: '#00ff00' }}>· EN LÍNEA</span>
                    </div>
                    <div className="has-tooltip" data-tooltip="Fuente de datos actual (DB o MOCK)" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                        <span>ORIGEN:</span>
                        <span style={{ color: '#ffb300' }}>· {stats.source}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                        <span>USUARIO:</span>
                        <div style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                            · <MarqueeName name={profile?.nombre || user?.email?.split('@')[0] || '········'} />
                        </div>
                    </div>
                    <div className="has-tooltip" data-tooltip="Nivel de privilegios del usuario" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                        <span>PERMISOS:</span>
                        <span style={{ color: (getPermisoLabel() === 'SIN ACCESO' || getPermisoLabel() === 'FAIL') ? '#ff4444' : '#ffb300' }}>
                            · {getPermisoLabel()}
                        </span>
                    </div>
                </div>
            </div>

            {/* [IO] Consola de Comandos - Fila Superior */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <BrutalButton tooltip="Verifica integridad y latencia" onClick={() => exec('checkup')}>ESTADO</BrutalButton>
                    <BrutalButton tooltip="Configuración de la asistencia LLM" onClick={() => setModal({ open: true, type: 'feedback' })}>LLM_CLI</BrutalButton>
                    <BrutalButton tooltip="Gestión de Secciones y Escenarios" onClick={() => setModal({ open: true, type: 'pauta' })}>PAUTAS</BrutalButton>
                    <BrutalButton tooltip="Estadísticas y métricas de uso" onClick={async () => { // Aquí disparamos la carga de datos
                        await exec('analytics');
                        setModal({ open: true, type: 'analytics' });
                    }} disabled={isLoading}>{isLoading ? <Spinner /> : 'DATOS'}</BrutalButton>
                </div>

                {/* Info técnica desplazada debajo de la primera fila de botones */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7em', padding: '10px 5px 0 5px', borderTop: '1px solid #444', marginTop: '10px' }}>
                    <span style={{ color: '#888' }}>&gt; API_ENDPOINT: {API_BASE}</span>
                    <span style={{ color: '#00ff00', padding: '2px 6px', border: '1px solid #00ff00', borderRadius: '4px' }}>Latencia CLI {stats.latencia || '--'}</span>
                    <button onClick={() => setLogs([`SYS_READY> Esperando comando...`])} style={{ background: '#1a1a1a', color: '#ffb300', border: 'none', padding: '4px 12px', cursor: 'pointer', fontFamily: 'Fira Code, monospace', fontWeight: 'bold', fontSize: '1.1em' }}>limpiar</button>
                </div>
            </div>

            {/* [IO] Terminal de Logs */}
            <div style={{ background: '#000', border: '1px solid #444', borderRadius: '4px', padding: '15px', height: '350px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px', color: '#ffb300', boxShadow: 'inset 0 0 15px #111' }}>
                {logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>

            {/* [IO] Modales de Gestión */}
            {modal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#1a1a1a', padding: '30px', width: '85%', height: '80%', boxShadow: '20px 20px 0px #000', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '20px', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>&gt;&gt; MOD_GESTIÓN ·· {modal.type === 'feedback' ? 'LLM_CLI' : modal.type === 'analytics' ? 'ESTADÍSTICAS' : modal.type.toUpperCase()}</span>
                            <span style={{ cursor: 'pointer', color: '#ff4444' }} onClick={() => { setModal({ open: false, type: '' }); setActiveGraph(null); }}>[CERRAR]</span>
                        </div>

                        <div style={{ color: '#ffb300' }}>
                            {modal.type === 'analytics' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <p>MÓDULO CENTRALIZADO DE GRÁFICOS DE DATOS</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#222', padding: '10px' }}>
                                        <BrutalButton small onClick={() => setActiveGraph('PIE_LOCATION')}>LOCACIÓN</BrutalButton>
                                        <BrutalButton small onClick={() => setActiveGraph('PIE_GENDER')}>GÉNERO</BrutalButton>
                                        <BrutalButton small onClick={() => setActiveGraph('PIE_AGE')}>EDAD</BrutalButton>
                                        <BrutalButton small onClick={() => setActiveGraph('BAR')}>CRECIMIENTO</BrutalButton>
                                        <BrutalButton small onClick={() => setActiveGraph('LINE')}>ACTIVIDAD</BrutalButton>
                                        <BrutalButton small onClick={() => setActiveGraph(null)}>limpiar</BrutalButton>
                                    </div>

                                    <div style={{ width: '100%', height: '350px', background: '#000', padding: '20px', position: 'relative' }}>
                                        {isLoading && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: '#00ff00' }}>SINCRONIZANDO FLUJO DE DATOS...</div>
                                        )}
                                        {activeGraph === 'PIE_GENDER' && stats.charts?.PIE_GENDER?.length > 0 && (
                                            <ResponsiveContainer width="99%" height="99%">
                                                <PieChart>
                                                    <Pie data={stats.charts?.PIE_GENDER} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                        {stats.charts?.PIE_GENDER?.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#ffb300', '#31C976', '#ff4444', '#00ff00'][index % 4]} />
                                                        ))}
                                                    </Pie>
                                                    <Legend />
                                                    <Tooltip
                                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #ffb300' }}
                                                        itemStyle={{ color: '#ffb300' }} // Eliminamos textTransform de aquí
                                                        formatter={(value, name, props) => [`${props.payload.name.toUpperCase()}: ${value}`]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                        {activeGraph === 'PIE_AGE' && stats.charts?.PIE_AGE?.length > 0 && (
                                            <ResponsiveContainer width="99%" height="99%">
                                                <PieChart>
                                                    <Pie data={stats.charts?.PIE_AGE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                        {stats.charts?.PIE_AGE?.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#ffb300', '#31C976', '#ff4444', '#00ff00'][index % 4]} />
                                                        ))}
                                                    </Pie>
                                                    <Legend />
                                                    <Tooltip
                                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #ffb300' }}
                                                        itemStyle={{ color: '#ffb300' }} // Eliminamos textTransform de aquí
                                                        formatter={(value, name, props) => [`${props.payload.name.toUpperCase()}: ${value}`]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                        {activeGraph === 'PIE_LOCATION' && stats.charts?.PIE_LOCATION?.length > 0 && (
                                            <ResponsiveContainer width="99%" height="99%">
                                                <PieChart>
                                                    <Pie data={stats.charts?.PIE_LOCATION} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                        {stats.charts?.PIE_LOCATION?.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#ffb300', '#31C976', '#ff4444', '#00ff00'][index % 4]} />
                                                        ))}
                                                    </Pie>
                                                    <Legend />
                                                    <Tooltip
                                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #ffb300' }}
                                                        itemStyle={{ color: '#ffb300' }} // Eliminamos textTransform de aquí
                                                        formatter={(value, name, props) => [`${props.payload.name.toUpperCase()}: ${value}`]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                        {activeGraph === 'BAR' && stats.charts?.BAR?.length > 0 && (
                                            <ResponsiveContainer width="99%" height="99%">
                                                <BarChart data={stats.charts?.BAR}>
                                                    <XAxis dataKey="fecha" stroke="#ffb300" tick={{fontSize: 10}} />
                                                    <YAxis stroke="#ffb300" />
                                                    <Tooltip
                                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #ffb300' }}
                                                        itemStyle={{ color: '#ffb300' }}
                                                        formatter={(val) => [val, "NUEVOS"]}
                                                    />
                                                    <Bar dataKey="cantidad" fill="#ffb300" label={{ position: 'top', fill: '#ffb300', fontSize: 10 }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                        {activeGraph === 'LINE' && stats.charts?.LINE?.length > 0 && (
                                            <ResponsiveContainer width="99%" height="99%">
                                                <LineChart data={stats.charts?.LINE}>
                                                    <XAxis dataKey="x" stroke="#ffb300" tick={{fontSize: 10}} />
                                                    <YAxis stroke="#ffb300" />
                                                    <Tooltip
                                                        contentStyle={{ background: '#1a1a1a', border: '1px solid #ffb300' }}
                                                        itemStyle={{ color: '#31C976' }}
                                                        formatter={(val) => [val, "PUNTOS"]}
                                                    />
                                                    <Line type="monotone" dataKey="y" stroke="#31C976" strokeWidth={3} dot={{ fill: '#31C976' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}
                                        {(!activeGraph || !stats.charts) && !isLoading && (
                                            <div style={{ textAlign: 'center', marginTop: '140px' }}>ACTIVÁ UNA VISTA</div>
                                        )}
                                        {activeGraph && stats.charts && stats.charts[activeGraph]?.length === 0 && !isLoading && (
                                            <div style={{ textAlign: 'center', marginTop: '140px', color: '#888' }}>NO HAY DATOS SUFICIENTES PARA ESTE CANAL</div>
                                        )}
                                    </div>
                                </div>
                            ) : modal.type === 'feedback' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <p>&gt; MÓDULO LLM: CONFIGURACIÓN PEDAGÓGICA</p>
                                    <div style={{ padding: '15px', background: '#000' }}>
                                        <span style={{ color: '#888' }}>PROMPT_ACTIVO:</span><br/>
                                        "Sos un tutor de matemáticas para adultos... Analizá por qué la respuesta elegída es errada y devolvé una respuesta amable, en lenguaje adulto, que oriente hacia la correcta, sin dar ésta explícitamente."
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <BrutalButton tooltip="Genera una consulta de prueba a la IA y muestra el resultado en la consola de logs" onClick={() => exec('test-feedback')}>IMPLEMENTAR ENSAYO DE CARGA</BrutalButton>
                                        <BrutalButton small tooltip="Módulo en desarrollo - No activo" onClick={() => addLog("INFO: Edición de prompt deshabilitada en esta versión.")}>EDITAR PROMPT</BrutalButton>
                                    </div>
                                </div>
                            ) : modal.type === 'pauta' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <p>&gt; MÓDULOS 'CRUD': CONTENIDOS</p>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <label>CRUD:</label>
                                        <select
                                            value={pautaTarget}
                                            onChange={(e) => setPautaTarget(e.target.value)}
                                            style={{ background: '#1a1a1a', color: '#ffb300', border: 'none', padding: '5px' }}
                                        >
                                            <option value="secciones">SECCIONES</option>
                                            <option value="escenarios">ESCENARIOS</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <BrutalButton small tooltip="En desarrollo" onClick={() => addLog(`BUSCAR: ${pautaTarget}`)}>BUSCAR ID/NOM</BrutalButton>
                                        <BrutalButton small tooltip="Próximamente" onClick={() => exec(pautaTarget)}>LISTAR TODO</BrutalButton>
                                        <BrutalButton small tooltip="Próximamente" onClick={() => addLog(`CREAR: ${pautaTarget}`)}>+ NUEVO REG</BrutalButton>
                                        <BrutalButton small tooltip="En desarrollo" onClick={() => addLog(`MODIFICAR: ${pautaTarget}`)}>EDITAR SELEC.</BrutalButton>
                                        <BrutalButton small tooltip="Próximamente" onClick={() => addLog(`ELIMINAR: ${pautaTarget}`)}>BORRADO FÍSICO</BrutalButton>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>&gt; Acceso a CRUD de {modal.type} activo.</p>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                        <BrutalButton onClick={() => exec(modal.type)}>LISTAR {modal.type.toUpperCase()}</BrutalButton>
                                        <BrutalButton onClick={() => addLog(`INFO: Formulario para ${modal.type} en construcción.`)}>+ CREAR NUEVO</BrutalButton>
                                    </div>
                                </div>
                            )}
                            <br/>
                            <BrutalButton small onClick={() => exec(modal.type === 'analytics' ? 'analytics' : modal.type)}>VER_DATA_JSON_CRUDA</BrutalButton>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default DebugDB;
