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
      pregunta: "Hacés las compras del día: gastás $4.500 en verdulería, $8.200 en carnicería y $2.300 en panadería. ¿Cuánto gastaste en total?",
      opciones: [
        { id: 1011, texto: "$15.000", esCorrecta: true },
        { id: 1012, texto: "$14.200", esCorrecta: false },
        { id: 1013, texto: "$16.500", esCorrecta: false },
      ],
    },
    {
      id: 102,
      tipo: "input",
      pregunta: "Tu compra en el supermercado sumó $16.400 y pagás con un billete de $20.000. ¿Cuánto vuelto exacto debés recibir?",
      respuestaEsperada: 3600,
    },
    {
      id: 103,
      tipo: "choice",
      pregunta: "Tenés un presupuesto semanal de $50.000 para comida. Si en los primeros 4 días gastaste $32.000, ¿cuánto podés gastar en los 3 días restantes?",
      opciones: [
        { id: 1031, texto: "$18.000", esCorrecta: true },
        { id: 1032, texto: "$22.000", esCorrecta: false },
        { id: 1033, texto: "$15.000", esCorrecta: false },
      ],
    }
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
    {
      id: 202,
      tipo: "choice",
      pregunta: "Una campera cuesta $40.000 y tiene un 20% de descuento por liquidación de temporada. ¿Cuánto pagarás finalmente?",
      opciones: [
        { id: 2021, texto: "$32.000", esCorrecta: true },
        { id: 2022, texto: "$36.000", esCorrecta: false },
        { id: 2023, texto: "$30.000", esCorrecta: false },
      ],
    },
    {
      id: 203,
      tipo: "input",
      pregunta: "Un electrodoméstico cuesta $200.000. Si pagás al contado te hacen un 15% de descuento directo. ¿Cuántos pesos te ahorrás?",
      respuestaEsperada: 30000,
    },
    {
      id: 204,
      tipo: "choice",
      pregunta: "En una promoción de 'Llevá 2 y la segunda unidad tiene 50% de descuento', si cada producto sale $6.000, ¿cuánto pagás por los 2?",
      opciones: [
        { id: 2041, texto: "$9.000", esCorrecta: true },
        { id: 2042, texto: "$10.000", esCorrecta: false },
        { id: 2043, texto: "$8.000", esCorrecta: false },
      ],
    }
  ],
  // Sección 3: División de Cuentas y Propinas
  3: [
    {
      id: 301,
      tipo: "input",
      pregunta: "Cena con amigos: La cuenta total es de $48.000 entre 4 personas en partes iguales. ¿Cuánto debe poner cada uno?",
      respuestaEsperada: 12000,
    },
    {
      id: 302,
      tipo: "choice",
      pregunta: "El total del restaurante fue de $35.000 y quieren dejar el 10% de propina sugerida al mozo. ¿Cuánto es la propina?",
      opciones: [
        { id: 3021, texto: "$3.500", esCorrecta: true },
        { id: 3022, texto: "$4.000", esCorrecta: false },
        { id: 3023, texto: "$3.000", esCorrecta: false },
      ],
    },
    {
      id: 303,
      tipo: "choice",
      pregunta: "Alquilan una cabaña por el fin de semana entre 5 personas por un total de $175.000. ¿Cuánto abona cada persona?",
      opciones: [
        { id: 3031, texto: "$35.000", esCorrecta: true },
        { id: 3032, texto: "$30.000", esCorrecta: false },
        { id: 3033, texto: "$40.000", esCorrecta: false },
      ],
    }
  ],
  // Sección 4: Cuotas vs Contado e Intereses
  4: [
    {
      id: 401,
      tipo: "choice",
      pregunta: "Comprás un producto por $120.000 al contado o en 6 cuotas fijas de $23.000. ¿Cuánto es el recargo total financiado?",
      opciones: [
        { id: 4011, texto: "$18.000", esCorrecta: true },
        { id: 4012, texto: "$15.000", esCorrecta: false },
        { id: 4013, texto: "$20.000", esCorrecta: false },
      ],
    },
    {
      id: 402,
      tipo: "input",
      pregunta: "Un celular cuesta $180.000 en 6 cuotas fijas sin interés. ¿De cuánto es el valor exacto de cada cuota mensual?",
      respuestaEsperada: 30000,
    },
    {
      id: 403,
      tipo: "choice",
      pregunta: "Una factura de gas de $15.000 tiene un recargo del 5% por abonarse después del vencimiento. ¿Cuánto pagarás en total?",
      opciones: [
        { id: 4031, texto: "$15.750", esCorrecta: true },
        { id: 4032, texto: "$16.500", esCorrecta: false },
        { id: 4033, texto: "$15.500", esCorrecta: false },
      ],
    }
  ],
  // Sección 5: Cocina, Medidas y Proporciones
  5: [
    {
      id: 501,
      tipo: "choice",
      pregunta: "Una receta de torta para 4 personas lleva 200 gramos de harina. Si querés preparar la torta para 8 personas, ¿cuánta harina necesitás?",
      opciones: [
        { id: 5011, texto: "400 gramos", esCorrecta: true },
        { id: 5012, texto: "300 gramos", esCorrecta: false },
        { id: 5013, texto: "500 gramos", esCorrecta: false },
      ],
    },
    {
      id: 502,
      tipo: "input",
      pregunta: "Un auto consume 8 litros de combustible cada 100 km en ruta. ¿Cuántos litros consumirá en un viaje de 250 km?",
      respuestaEsperada: 20,
    },
    {
      id: 503,
      tipo: "choice",
      pregunta: "Si 3 metros de tela cuestan $18.000, ¿cuánto costarán 5 metros de la misma tela?",
      opciones: [
        { id: 5031, texto: "$30.000", esCorrecta: true },
        { id: 5032, texto: "$28.000", esCorrecta: false },
        { id: 5033, texto: "$32.000", esCorrecta: false },
      ],
    }
  ],
  // Sección 6: Gran Desafío Maestro de la Vida Diaria
  6: [
    {
      id: 601,
      tipo: "choice",
      pregunta: "En una ferretería comprás 2 cajas de tornillos a $3.500 c/u y una herramienta a $14.000. Con 10% de descuento sobre el total, ¿cuánto pagás?",
      opciones: [
        { id: 6011, texto: "$18.900", esCorrecta: true },
        { id: 6012, texto: "$19.500", esCorrecta: false },
        { id: 6013, texto: "$18.000", esCorrecta: false },
      ],
    },
    {
      id: 602,
      tipo: "input",
      pregunta: "Ahorrás $15.000 por mes durante 8 meses seguidos para unas vacaciones. ¿Cuánto dinero tenés ahorrado en total al finalizar?",
      respuestaEsperada: 120000,
    },
    {
      id: 603,
      tipo: "choice",
      pregunta: "Un tanque de agua de 1.000 litros se vacía a razón de 50 litros por minuto. ¿Cuántos minutos tarda en vaciarse por completo?",
      opciones: [
        { id: 6031, texto: "20 minutos", esCorrecta: true },
        { id: 6032, texto: "25 minutos", esCorrecta: false },
        { id: 6033, texto: "15 minutos", esCorrecta: false },
      ],
    }
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
    setCargando(true);
    setError(null);

    const defaultForSection = SCENARIOS_BY_SECTION[idSeccionActual] || SCENARIOS_BY_SECTION[2];

    api
      .get(`/secciones/${idSeccionActual}/escenarios`)
      .then((res) => {
        if (!activo) return;
        const data = res.data && res.data.length > 0 ? res.data : defaultForSection;
        setEscenarios(data);
        setIndexActual(0);
      })
      .catch((err) => {
        if (!activo) return;
        console.warn("Cargando escenarios de práctica autónomos:", err.message);
        setEscenarios(defaultForSection);
        setIndexActual(0);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [idSeccionActual]);

  const ejercicioActual = escenarios[indexActual];

  const manejarRespuesta = async ({ opcionId, respuestaUsuario }) => {
    if (!ejercicioActual || enviando) return;

    setEnviando(true);
    setUltimoResultado(null);

    let esCorrecto = false;
    let feedback = "";

    // 1. Evaluar si es opción múltiple (Choice)
    if (opcionId !== undefined && opcionId !== null) {
      const opt = ejercicioActual.opciones?.find((o) => o.id === opcionId);
      esCorrecto = Boolean(opt?.esCorrecta);
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

    const resultadoFinal = {
      esCorrecto,
      puntosGanados: esCorrecto ? 50 : 0,
      monedasGanadas: esCorrecto ? 10 : 0,
      rachaActual: esCorrecto ? (sessionStats.racha + 1) : sessionStats.racha,
      feedback,
      seccionNombre: "Cálculo Cotidiano",
      seccionAprobada: false,
    };

    // Intentar sincronizar progreso con API si existe
    try {
      await api.post("/progreso", {
        escenarioId: ejercicioActual.id,
        ...(opcionId ? { opcionId } : { respuestaUsuario }),
      });
    } catch (e) {
      // Offline fallback
    }

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
        {ejercicioActual.tipo === "numerico" ? (
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
            onResponder={(opcionId) => manejarRespuesta({ opcionId })}
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