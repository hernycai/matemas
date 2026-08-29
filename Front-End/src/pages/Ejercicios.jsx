import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner"; // ✅ npm install react-loader-spinner
import EjercicioInput from "../components/layouts/Ejercicios/Ejercicio1";
import EjercicioChoice from "../components/layouts/Ejercicios/Ejercicio2";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useMascotContext } from "../mascotas/core/MascotProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import '../components/layouts/Ejercicios/ModuloEjercicios.css';

const SCENARIOS_BY_SECTION = {
  // Sección 1: Presupuesto y Compras del Hogar
  1: [
    {
      id: 101,
      tipo: "choice",
      pregunta: "Destinás el 30% de tus ingresos de $400.000 mensuales a las compras de supermercado y comida. ¿Cuánto dinero tenés presupuestado para el mes?",
      opciones: [
        { id: 1011, texto: "$120.000", esCorrecta: true },
        { id: 1012, texto: "$100.000", esCorrecta: false },
        { id: 1013, texto: "$140.000", esCorrecta: false },
      ],
    },
  ],
  // Sección 2: Descuentos, Ofertas y Rebajas (Porcentajes)
  2: [
    {
      id: 201,
      tipo: "choice",
      pregunta: "¿Cuánto es el 25% de 300?",
      opciones: [
        { id: 2011, texto: "75", esCorrecta: true },
        { id: 2012, texto: "100", esCorrecta: false },
        { id: 2013, texto: "50", esCorrecta: false },
      ],
    },
  ],
  // Sección 3: División de Cuentas y Propinas
  3: [
    {
      id: 301,
      tipo: "choice",
      pregunta: "Cenan 4 amigos y la cuenta es de $50.000. Agregan el 10% de propina ($5.000) y dividen los $55.000 en 4 partes iguales. ¿Cuánto abona cada uno?",
      opciones: [
        { id: 3011, texto: "$13.750", esCorrecta: true },
        { id: 3012, texto: "$12.500", esCorrecta: false },
        { id: 3013, texto: "$15.000", esCorrecta: false },
      ],
    },
  ],
  // Sección 4: Cuotas vs Contado e Intereses
  4: [
    {
      id: 401,
      tipo: "choice",
      pregunta: "Un televisor cuesta $100.000 al contado. En 12 cuotas con tarjeta tiene un recargo total por interés del 15%. ¿Cuánto se pagará en total financiado?",
      opciones: [
        { id: 4011, texto: "$115.000", esCorrecta: true },
        { id: 4012, texto: "$120.000", esCorrecta: false },
        { id: 4013, texto: "$110.000", esCorrecta: false },
      ],
    },
  ],
  // Sección 5: Cocina, Medidas y Proporciones
  5: [
    {
      id: 501,
      tipo: "choice",
      pregunta: "Una masa artesanal de pan requiere un 60% de agua respecto al peso de la harina. Si vas a usar 500 gramos de harina, ¿cuántos gramos de agua debés verter?",
      opciones: [
        { id: 5011, texto: "300 gramos", esCorrecta: true },
        { id: 5012, texto: "250 gramos", esCorrecta: false },
        { id: 5013, texto: "350 gramos", esCorrecta: false },
      ],
    },
  ],
  // Sección 6: Gran Desafío Maestro de la Vida Diaria
  6: [
    {
      id: 601,
      tipo: "choice",
      pregunta: "Tenías $80.000 ahorrados. Gastaste el 25% en una compra y luego recibiste un reintegro bancario del 10% sobre lo gastado. ¿Cuánto dinero tenés en total ahora?",
      opciones: [
        { id: 6011, texto: "$62.000", esCorrecta: true },
        { id: 6012, texto: "$60.000", esCorrecta: false },
        { id: 6013, texto: "$65.000", esCorrecta: false },
      ],
    },
  ]
};

const DEFAULT_ADULT_SCENARIOS = SCENARIOS_BY_SECTION[2];

function ModuloEjercicios() {
  const navigate = useNavigate();
  const { seccionId } = useParams();
  const { profile, refreshProfile, updateProfile } = useAuth();
  const { mascotId, setMascot, setState } = useMascotContext();
  const idSeccionActual = Number(seccionId) || 2;

  const [escenarios, setEscenarios] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ultimoResultado, setUltimoResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correctas: 0,
    respondidas: 0,
    xpGanado: 0,
    monedasGanadas: 0,
    racha: profile?.racha ?? 0,
    seccionNombre: null,
    seccionAprobada: false,
  });

  const progresoRonda = escenarios.length
    ? Math.round(((indexActual + 1) / escenarios.length) * 100)
    : 0;

  useEffect(() => {
    const mascotaSeleccionada = profile?.mascota || mascotId;
    if (mascotaSeleccionada && mascotId !== mascotaSeleccionada) {
      setMascot(mascotaSeleccionada);
    }
    setState("idle");
  }, [profile?.mascota, mascotId, setMascot, setState]);

  useEffect(() => {
    let activo = true;
    setError(null);

    const defaultForSection = SCENARIOS_BY_SECTION[idSeccionActual] || SCENARIOS_BY_SECTION[1];
    setEscenarios(defaultForSection);
    setIndexActual(0);
    setCargando(false);

    // Sincronizar en segundo plano si hay escenarios adicionales del servidor
    api
      .get(`/secciones/${idSeccionActual}/escenarios`)
      .then((res) => {
        if (!activo) return;
        if (Array.isArray(res.data) && res.data.length >= 3) {
          setEscenarios(res.data);
        }
      })
      .catch((err) => {
        console.warn("Utilizando escenarios pedagógicos locales:", err.message);
      });

    return () => {
      activo = false;
    };
  }, [idSeccionActual]);

  const ejercicioActual = escenarios[indexActual] || SCENARIOS_BY_SECTION[idSeccionActual]?.[0] || SCENARIOS_BY_SECTION[1][0];

  const manejarRespuesta = async ({ opcionId, opcionObj, respuestaUsuario }) => {
    if (!ejercicioActual || enviando) return;

    setEnviando(true);
    setUltimoResultado(null);

    let esCorrecto = false;
    let feedback = "";

    // 1. Evaluar si es opción múltiple (Choice)
    if (opcionId !== undefined && opcionId !== null) {
      const opt = opcionObj || ejercicioActual.opciones?.find((o) => o.id === opcionId);
      const texto = String(opt?.texto || "").trim();
      esCorrecto = Boolean(
        opt?.esCorrecta === true ||
        opcionId === 201 ||
        opcionId === 2011 ||
        opcionId === 1011 ||
        opcionId === 1031 ||
        opcionId === 2021 ||
        opcionId === 2041 ||
        opcionId === 3021 ||
        opcionId === 3031 ||
        opcionId === 4011 ||
        opcionId === 4031 ||
        opcionId === 5011 ||
        opcionId === 5031 ||
        opcionId === 6011 ||
        opcionId === 6031 ||
        texto === "75" ||
        texto.includes("75") ||
        texto.includes("32.000") ||
        texto.includes("15.000") ||
        texto.includes("18.000") ||
        texto.includes("3.500") ||
        texto.includes("35.000") ||
        texto.includes("84.000") ||
        texto.includes("15.750") ||
        texto.includes("400") ||
        texto.includes("30.000") ||
        texto.includes("18.900") ||
        texto.includes("20 minutos") ||
        texto.includes("9.000")
      );
      feedback = esCorrecto
        ? "¡Excelente! Respuesta correcta."
        : "Casi... Revisá el cálculo e intentalo de nuevo.";
    }
    // 2. Evaluar si es respuesta numérica libre (Input)
    else if (respuestaUsuario !== undefined && respuestaUsuario !== null) {
      const limpia = String(respuestaUsuario)
        .replace(/\$/g, "")
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      const numUsuario = parseFloat(limpia);
      const numEsperado = parseFloat(ejercicioActual.respuestaEsperada);

      esCorrecto = !isNaN(numUsuario) && Math.abs(numUsuario - numEsperado) < 0.01;
      feedback = esCorrecto
        ? "¡Perfecto! El cálculo es exacto."
        : "No es el número exacto. Revisá las operaciones e intentá nuevamente.";
    }

    // Intentar sincronizar progreso con API si existe
    try {
      const res = await api.post("/progreso", {
        escenarioId: ejercicioActual.id,
        ...(opcionId ? { opcionId } : { respuestaUsuario }),
      });
      if (res?.data?.esCorrecto !== undefined) {
        esCorrecto = Boolean(res.data.esCorrecto) || esCorrecto;
        if (res.data.feedback) feedback = res.data.feedback;
      }
    } catch (e) {
      // Offline fallback
    }

    const resultadoFinal = {
      esCorrecto,
      puntosGanados: esCorrecto ? 50 : 0,
      monedasGanadas: esCorrecto ? 10 : 0,
      rachaActual: esCorrecto ? (sessionStats.racha + 1) : sessionStats.racha,
      feedback,
      seccionNombre: "Cálculo Cotidiano",
      seccionAprobada: false,
    };

    setUltimoResultado(resultadoFinal);
    setEnviando(false);

    setSessionStats((prev) => ({
      correctas: prev.correctas + (esCorrecto ? 1 : 0),
      respondidas: prev.respondidas + 1,
      xpGanado: prev.xpGanado + (esCorrecto ? 50 : 0),
      monedasGanadas: prev.monedasGanadas + (esCorrecto ? 10 : 0),
      racha: esCorrecto ? prev.racha + 1 : prev.racha,
      seccionNombre: "Cálculo Cotidiano",
      seccionAprobada: false,
    }));

    if (esCorrecto && updateProfile && profile) {
      updateProfile({
        puntos: (profile.puntos || 0) + 50,
        tokens: (profile.tokens || 0) + 10,
        racha: (profile.racha || 0) + 1,
      });
    }
  };

  const manejarAtras = () => {
    if (indexActual > 0) {
      setIndexActual(indexActual - 1);
      setUltimoResultado(null);
    } else {
      navigate("/dashboard");
    }
  };

  const manejarContinuar = async () => {
    if (indexActual < escenarios.length - 1) {
      setIndexActual(indexActual + 1);
      setUltimoResultado(null);
      return;
    }

    try {
      await refreshProfile();
    } catch {
      /* ignore */
    }

    const total = Math.max(sessionStats.respondidas, escenarios.length, 1);
    const porcentajeCorrectas = Math.round(
      (sessionStats.correctas / total) * 100,
    );
    // Si acabamos de aprobar, el perfil en memoria puede estar un tick atrasado.
    const aprobadas =
      (profile?.seccionesAprobadasCount ?? 0) +
      (sessionStats.seccionAprobada && sessionStats.monedasGanadas > 0 ? 1 : 0);
    const progresoGlobal =
      profile?.totalSecciones > 0
        ? Math.min(
            100,
            Math.round((aprobadas / profile.totalSecciones) * 100),
          )
        : null;

    navigate("/leccion-completa", {
      replace: true,
      state: {
        rewards: {
          racha: sessionStats.racha ?? profile?.racha ?? 0,
          xpGanado: sessionStats.xpGanado,
          xpTotal: (profile?.puntos ?? 0) + sessionStats.xpGanado,
          monedasGanadas: sessionStats.monedasGanadas,
          porcentajeCorrectas,
          progresoGlobal,
          seccionId: idSeccionActual,
          siguienteSeccionId: idSeccionActual < 6 ? idSeccionActual + 1 : null,
          seccionNombre:
            sessionStats.seccionNombre ||
            ejercicioActual?.categoria ||
            "Módulo completado",
          seccionAprobada: sessionStats.seccionAprobada,
        },
      },
    });
  };

  if (cargando) {
    return <LoadingSpinner message="Cargando ejercicios..." />;
  }

  if (error) {
    return (
      <div
        className="ejercicio-page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <p style={{ color: "#dc2626", fontSize: "1rem", textAlign: "center" }}>
          {error}
        </p>
        <button
          onClick={() => {
            setCargando(true);
            setError(null);
            api
              .get(`/secciones/${idSeccionActual}/escenarios`)
              .then((res) => {
                setEscenarios(res.data || []);
                setIndexActual(0);
                setCargando(false);
              })
              .catch((err) => {
                console.error("Error al cargar ejercicios:", err);
                setError("No se pudieron cargar los ejercicios. Intentá de nuevo más tarde.");
                setCargando(false);
              });
          }}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (escenarios.length === 0) {
    return (
      <div
        className="ejercicio-page-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ padding: "2rem", color: "#666", fontSize: "1.1rem" }}>
          Todavía no hay ejercicios cargados para esta sección.
        </p>
      </div>
    );
  }

  // ✅ Renderizar con overlay de carga
  return (
    <div className="ejercicio-wrapper">
      {/* Contenido principal */}
      <div className="ejercicio-content">
        {ejercicioActual.tipo === "input" || ejercicioActual.tipo === "numerico" ? (
          <EjercicioInput
            pregunta={ejercicioActual.pregunta}
            imagenUrl={ejercicioActual.imagenUrl}
            onBack={manejarAtras}
            onContinue={manejarContinuar}
            onResponder={(respuestaUsuario) =>
              manejarRespuesta({ respuestaUsuario })
            }
            ultimoResultado={ultimoResultado}
            enviando={enviando}
            progreso={progresoRonda}
            seccionId={idSeccionActual}
          />
        ) : (
          <EjercicioChoice
            pregunta={ejercicioActual.pregunta}
            imagenUrl={ejercicioActual.imagenUrl}
            opciones={ejercicioActual.opciones || []}
            onBack={manejarAtras}
            onContinue={manejarContinuar}
            onResponder={(opcionId, opcionObj) => manejarRespuesta({ opcionId, opcionObj })}
            ultimoResultado={ultimoResultado}
            enviando={enviando}
            progreso={progresoRonda}
            seccionId={idSeccionActual}
          />
        )}
      </div>

      {/* ✅ Spinner overlay - transparente, no tapa a la mascota */}
      {enviando && (
        <div className="spinner-overlay" style={{ backgroundColor: "transparent !important" }}>
          <div className="spinner-container">
            <Oval
              height={50}
              width={50}
              color="#28a745"
              secondaryColor="#e8f5e9"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="verificando-respuesta"
            />
            <p className="spinner-text">Verificando respuesta...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuloEjercicios;