import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import EjercicioInput from "../components/layouts/Ejercicios/Ejercicio1";
import EjercicioChoice from "../components/layouts/Ejercicios/Ejercicio2";
import ModalCalculadora from "../components/layouts/Calculadora/Calculadora";
import PizarraBorrador from "../components/layouts/Ejercicios/PizarraBorrador";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useMascotContext } from "../mascotas/core/MascotProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import "../components/layouts/Ejercicios/ModuloEjercicios.css";

const SCENARIOS_BY_SECTION = {
  // Sección 1: Presupuesto y Compras del Hogar
  1: [
    {
      id: 101,
      tipo: "choice",
      pregunta: "Destinás el 30% de tus ingresos de $400.000 mensuales a las compras de supermercado y comida. ¿Cuánto dinero tenés presupuestado para el mes?",
      pista: "Multiplicá $400.000 por 0,30 (o dividí 400.000 por 10 y multiplicalo por 3).",
      explicacionPasoAPaso: "El 30% de $400.000 se calcula como: $400.000 × (30 / 100) = $400.000 × 0,30 = $120.000 presupuestados para comida.",
      opciones: [
        { id: 1011, texto: "$120.000", esCorrecta: true },
        { id: 1012, texto: "$100.000", esCorrecta: false },
        { id: 1013, texto: "$140.000", esCorrecta: false },
      ],
    },
    {
      id: 102,
      tipo: "choice",
      pregunta: "En el súper podés comprar un pack de 3 litros de leche por $2.700, o comprar los litros sueltos a $980 cada uno. ¿Cuánto ahorrás en total llevando el pack de 3?",
      pista: "Calculá cuánto saldrían los 3 litros sueltos (3 × $980) y restale el precio del pack ($2.700).",
      explicacionPasoAPaso: "3 litros sueltos cuestan: 3 × $980 = $2.940. Comprando el pack a $2.700, ahorrás: $2.940 - $2.700 = $240 en total.",
      opciones: [
        { id: 1021, texto: "$240", esCorrecta: true },
        { id: 1022, texto: "$180", esCorrecta: false },
        { id: 1023, texto: "$320", esCorrecta: false },
      ],
    },
    {
      id: 103,
      tipo: "input",
      pregunta: "Tus ingresos mensuales son de $350.000 y la suma de todos tus gastos fijos es de $280.000. ¿Cuántos pesos te quedan disponibles para tu fondo de ahorro mensual?",
      pista: "Restá los gastos fijos del total de ingresos: $350.000 - $280.000.",
      explicacionPasoAPaso: "Ingresos ($350.000) menos Gastos fijos ($280.000) = $70.000 disponibles para ahorro mensual.",
      respuestaEsperada: "70000",
      opciones: [],
    },
  ],
  // Sección 2: Descuentos, Ofertas y Rebajas (Porcentajes)
  2: [
    {
      id: 201,
      tipo: "choice",
      pregunta: "Un par de zapatillas cuesta $60.000 en vidriera y tiene una rebaja del 25% por fin de temporada. ¿Cuál es el precio final con el descuento aplicado?",
      pista: "El 25% es la cuarta parte (dividir por 4). Restale ese monto al precio original de $60.000.",
      explicacionPasoAPaso: "Descuento del 25%: $60.000 × 0,25 = $15.000 de rebaja. Precio final: $60.000 - $15.000 = $45.000.",
      opciones: [
        { id: 2011, texto: "$45.000", esCorrecta: true },
        { id: 2012, texto: "$50.000", esCorrecta: false },
        { id: 2013, texto: "$35.000", esCorrecta: false },
      ],
    },
    {
      id: 202,
      tipo: "choice",
      pregunta: "Hay una promo 3x2 en frascos de café de $4.500 cada uno (llevás 3 y pagás solo 2). ¿Cuánto pagás en total por los 3 frascos?",
      pista: "Como pagás 2 unidades, multiplicá el precio individual por 2.",
      explicacionPasoAPaso: "En la promo 3x2 pagás 2 unidades: 2 × $4.500 = $9.000 en total por los 3 frascos (cada uno te queda a un promedio de $3.000).",
      opciones: [
        { id: 2021, texto: "$9.000", esCorrecta: true },
        { id: 2022, texto: "$13.500", esCorrecta: false },
        { id: 2023, texto: "$7.500", esCorrecta: false },
      ],
    },
    {
      id: 203,
      tipo: "input",
      pregunta: "Una campera cuesta $40.000. Por pago en efectivo te descuentan el 15%. ¿Cuántos pesos te descuentan?",
      pista: "Calculá el 15% de $40.000 (multiplicá por 15 y dividí por 100).",
      explicacionPasoAPaso: "El 15% de $40.000 es: $40.000 × 0,15 = $6.000 de descuento.",
      respuestaEsperada: "6000",
      opciones: [],
    },
    {
      id: 204,
      tipo: "choice",
      pregunta: "Llevás dos remeras del mismo valor de $16.000 cada una. La segunda remera tiene un 50% de descuento. ¿Cuánto abonás en total por ambas prendas?",
      pista: "La primera remera paga $16.000 y la segunda paga la mitad ($8.000).",
      explicacionPasoAPaso: "Primera remera: $16.000. Segunda remera con 50%: $8.000. Total abonado: $16.000 + $8.000 = $24.000.",
      opciones: [
        { id: 2041, texto: "$24.000", esCorrecta: true },
        { id: 2042, texto: "$28.000", esCorrecta: false },
        { id: 2043, texto: "$20.000", esCorrecta: false },
      ],
    },
  ],
  // Sección 3: División de Cuentas y Propinas
  3: [
    {
      id: 301,
      tipo: "choice",
      pregunta: "Cenan 4 amigos y la cuenta suma $50.000. Acuerdan sumar un 10% de propina voluntaria ($5.000), totalizando $55.000 divididos en 4 partes iguales. ¿Cuánto abona cada uno?",
      pista: "Dividí $55.000 entre 4 personas.",
      explicacionPasoAPaso: "Monto total con propina: $55.000. Dividido entre 4 amigos: $55.000 ÷ 4 = $13.750 por persona.",
      opciones: [
        { id: 3011, texto: "$13.750", esCorrecta: true },
        { id: 3012, texto: "$12.500", esCorrecta: false },
        { id: 3013, texto: "$15.000", esCorrecta: false },
      ],
    },
    {
      id: 302,
      tipo: "choice",
      pregunta: "Compraron 2 pizzas y empanadas por un total de $36.000 entre 3 amigos. Uno de ellos pagó las bebidas aparte y acuerdan que solo abonará $6.000. ¿Cuánto deben pagar los otros 2 amigos en partes iguales?",
      pista: "Restale los $6.000 al total de $36.000, y el remanente dividilo entre los 2 amigos.",
      explicacionPasoAPaso: "Remanente a pagar: $36.000 - $6.000 = $30.000. Dividido entre los otros 2 amigos: $30.000 ÷ 2 = $15.000 cada uno.",
      opciones: [
        { id: 3021, texto: "$15.000", esCorrecta: true },
        { id: 3022, texto: "$18.000", esCorrecta: false },
        { id: 3023, texto: "$12.000", esCorrecta: false },
      ],
    },
    {
      id: 303,
      tipo: "input",
      pregunta: "La cuenta de una merienda en un café fue de $18.500. Deciden dejar exactamente el 10% de propina voluntaria. ¿Cuántos pesos de propina dejan en total?",
      pista: "Para calcular el 10%, simplemente corré la coma un lugar a la izquierda (dividí por 10).",
      explicacionPasoAPaso: "El 10% de $18.500 se calcula dividiendo por 10: $18.500 ÷ 10 = $1.850 de propina.",
      respuestaEsperada: "1850",
      opciones: [],
    },
  ],
  // Sección 4: Cuotas vs Contado e Intereses
  4: [
    {
      id: 401,
      tipo: "choice",
      pregunta: "Un televisor cuesta $100.000 al contado. En 12 cuotas fijas con tarjeta tiene un recargo por financiamiento del 15% en total. ¿Cuánto se pagará en total al finalizar las 12 cuotas?",
      pista: "Calculá el 15% de interés ($15.000) y sumalo al precio contado ($100.000).",
      explicacionPasoAPaso: "Recargo por interés del 15%: $100.000 × 0,15 = $15.000. Total financiado: $100.000 + $15.000 = $115.000.",
      opciones: [
        { id: 4011, texto: "$115.000", esCorrecta: true },
        { id: 4012, texto: "$120.000", esCorrecta: false },
        { id: 4013, texto: "$110.000", esCorrecta: false },
      ],
    },
    {
      id: 402,
      tipo: "choice",
      pregunta: "Un smartphone sale $200.000 de contado, o podés financiarlo en 6 cuotas fijas de $38.000 cada una. ¿Cuánto dinero de más (interés total) pagás si optás por las 6 cuotas?",
      pista: "Multiplicá 6 × $38.000 para saber el total en cuotas, y restale el precio al contado de $200.000.",
      explicacionPasoAPaso: "Total en cuotas: 6 × $38.000 = $228.000. Interés total pagado de más: $228.000 - $200.000 = $28.000.",
      opciones: [
        { id: 4021, texto: "$28.000", esCorrecta: true },
        { id: 4022, texto: "$38.000", esCorrecta: false },
        { id: 4023, texto: "$18.000", esCorrecta: false },
      ],
    },
    {
      id: 403,
      tipo: "input",
      pregunta: "Un lavarropas cuesta $180.000 y se ofrece en una promoción de 6 cuotas fijas SIN INTERÉS. ¿De cuánto es exactamente el valor de cada cuota mensual?",
      pista: "Dividí el precio total $180.000 entre 6 cuotas iguales.",
      explicacionPasoAPaso: "Al ser sin interés, se divide el monto original: $180.000 ÷ 6 = $30.000 por cuota mensual.",
      respuestaEsperada: "30000",
      opciones: [],
    },
  ],
  // Sección 5: Cocina, Medidas y Proporciones
  5: [
    {
      id: 501,
      tipo: "choice",
      pregunta: "Una masa artesanal de pan requiere un 60% de agua respecto al peso de la harina. Si vas a usar 500 gramos de harina, ¿cuántos gramos de agua debés verter?",
      pista: "Calculá el 60% de 500 gramos (500 × 0,60).",
      explicacionPasoAPaso: "Agua requerida: 500 gramos de harina × 0,60 = 300 gramos (o mililitros) de agua.",
      opciones: [
        { id: 5011, texto: "300 gramos", esCorrecta: true },
        { id: 5012, texto: "250 gramos", esCorrecta: false },
        { id: 5013, texto: "350 gramos", esCorrecta: false },
      ],
    },
    {
      id: 502,
      tipo: "choice",
      pregunta: "Una receta de salsa para 4 comensales requiere 300 gramos de carne picada. Si hoy vas a cocinar para 6 personas, ¿cuántos gramos de carne picada necesitarás manteniendo la proporción?",
      pista: "Averiguá cuánta carne es por persona (300 ÷ 4 = 75g) y multiplicala por 6.",
      explicacionPasoAPaso: "Regla de tres simple o cálculo unitario: 300g ÷ 4 = 75g por persona. Para 6 personas: 75g × 6 = 450 gramos.",
      opciones: [
        { id: 5021, texto: "450 gramos", esCorrecta: true },
        { id: 5022, texto: "500 gramos", esCorrecta: false },
        { id: 5023, texto: "400 gramos", esCorrecta: false },
      ],
    },
    {
      id: 503,
      tipo: "input",
      pregunta: "Tenés una botella de 1.500 mililitros (1,5 litros) de jugo concentrado. Si para preparar un vaso usás 50 mililitros de jugo concentrado, ¿cuántos vasos podés preparar con toda la botella?",
      pista: "Dividí la cantidad total en la botella (1.500 ml) entre la cantidad por vaso (50 ml).",
      explicacionPasoAPaso: "1.500 ml ÷ 50 ml por vaso = 30 vasos completos de jugo.",
      respuestaEsperada: "30",
      opciones: [],
    },
  ],
  // Sección 6: Gran Desafío Maestro de la Vida Diaria
  6: [
    {
      id: 601,
      tipo: "choice",
      pregunta: "Tenías $80.000 ahorrados. Gastaste el 25% en una compra ($20.000) y luego tu billetera virtual te acreditó un reintegro del 10% sobre lo que gastaste. ¿Cuánto dinero tenés en total ahora?",
      pista: "Quedaban $60.000 ($80.000 - $20.000) y recibiste el 10% de los $20.000 gastados ($2.000). Sumalos.",
      explicacionPasoAPaso: "Gasto del 25%: $80.000 × 0,25 = $20.000. Quedaban: $60.000. Reintegro del 10% sobre $20.000 = $2.000. Total actual: $60.000 + $2.000 = $62.000.",
      opciones: [
        { id: 6011, texto: "$62.000", esCorrecta: true },
        { id: 6012, texto: "$60.000", esCorrecta: false },
        { id: 6013, texto: "$65.000", esCorrecta: false },
      ],
    },
    {
      id: 602,
      tipo: "choice",
      pregunta: "Vas a hacer un viaje en auto de 350 km. Tu vehículo consume 8 litros de combustible cada 100 km. Si el litro cuesta $1.100, ¿cuánto gastarás en combustible para este trayecto?",
      pista: "Primero calculá cuántos litros consumís en 350 km (3,5 × 8 litros = 28 litros), luego multiplicalo por $1.100.",
      explicacionPasoAPaso: "Litros necesarios: (350 / 100) × 8 = 3,5 × 8 = 28 litros. Costo total: 28 litros × $1.100 = $30.800.",
      opciones: [
        { id: 6021, texto: "$30.800", esCorrecta: true },
        { id: 6022, texto: "$35.000", esCorrecta: false },
        { id: 6023, texto: "$26.400", esCorrecta: false },
      ],
    },
    {
      id: 603,
      tipo: "input",
      pregunta: "Un curso online tiene un valor de $150.000. Si pagás por transferencia bancaria directa tenés un 20% de descuento. ¿Cuántos pesos ahorrás con este descuento?",
      pista: "Calculá el 20% de $150.000 (multiplicá $150.000 por 0,20).",
      explicacionPasoAPaso: "Ahorro del 20%: $150.000 × 0,20 = $30.000 de ahorro.",
      respuestaEsperada: "30000",
      opciones: [],
    },
  ],
};

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
  const [calculadoraAbierta, setCalculadoraAbierta] = useState(false);
  const [pizarraAbierta, setPizarraAbierta] = useState(false);

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

  const ejercicioActual =
    escenarios[indexActual] ||
    SCENARIOS_BY_SECTION[idSeccionActual]?.[0] ||
    SCENARIOS_BY_SECTION[1][0];

  const manejarRespuesta = async ({ opcionId, opcionObj, respuestaUsuario }) => {
    if (!ejercicioActual || enviando) return;

    setEnviando(true);
    setUltimoResultado(null);

    let esCorrecto = false;
    let feedback = "";

    // 1. Evaluar si es opción múltiple (Choice)
    if (opcionId !== undefined && opcionId !== null) {
      const opt = opcionObj || ejercicioActual.opciones?.find((o) => o.id === opcionId);
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

    // Sincronizar progreso con la API
    try {
      const res = await api.post("/progreso", {
        escenarioId: ejercicioActual.id,
        ...(opcionId ? { opcionId } : { respuestaUsuario }),
      });
      if (res?.data?.esCorrecto !== undefined) {
        esCorrecto = Boolean(res.data.esCorrecto) || esCorrecto;
        if (res.data.feedback) feedback = res.data.feedback;
      }
    } catch {
      // Continuar con evaluación local si falla la red
    }

    const resultadoFinal = {
      esCorrecto,
      puntosGanados: esCorrecto ? 50 : 0,
      monedasGanadas: esCorrecto ? 10 : 0,
      rachaActual: esCorrecto ? sessionStats.racha + 1 : sessionStats.racha,
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
      (sessionStats.correctas / total) * 100
    );
    const aprobadas =
      (profile?.seccionesAprobadasCount ?? 0) +
      (sessionStats.seccionAprobada && sessionStats.monedasGanadas > 0 ? 1 : 0);
    const progresoGlobal =
      profile?.totalSecciones > 0
        ? Math.min(
            100,
            Math.round((aprobadas / profile.totalSecciones) * 100)
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

  return (
    <div className="ejercicio-wrapper">
      {/* Contenido principal del ejercicio */}
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
            onOpenCalculadora={() => setCalculadoraAbierta(true)}
            onOpenPizarra={() => setPizarraAbierta(true)}
            rondaInfo={{ actual: indexActual + 1, total: escenarios.length }}
            explicacionPasoAPaso={ejercicioActual.explicacionPasoAPaso}
            pista={ejercicioActual.pista}
          />
        ) : (
          <EjercicioChoice
            pregunta={ejercicioActual.pregunta}
            imagenUrl={ejercicioActual.imagenUrl}
            opciones={ejercicioActual.opciones || []}
            onBack={manejarAtras}
            onContinue={manejarContinuar}
            onResponder={(opcionId, opcionObj) =>
              manejarRespuesta({ opcionId, opcionObj })
            }
            ultimoResultado={ultimoResultado}
            enviando={enviando}
            progreso={progresoRonda}
            seccionId={idSeccionActual}
            onOpenCalculadora={() => setCalculadoraAbierta(true)}
            onOpenPizarra={() => setPizarraAbierta(true)}
            rondaInfo={{ actual: indexActual + 1, total: escenarios.length }}
            explicacionPasoAPaso={ejercicioActual.explicacionPasoAPaso}
            pista={ejercicioActual.pista}
          />
        )}
      </div>

      {/* Modal Calculadora Cotidiana Integrada */}
      <ModalCalculadora
        isOpen={calculadoraAbierta}
        onClose={() => setCalculadoraAbierta(false)}
      />

      {/* Modal Pizarra Borrador Matemática */}
      <PizarraBorrador
        isOpen={pizarraAbierta}
        onClose={() => setPizarraAbierta(false)}
      />

      {/* Spinner overlay para retroalimentación asíncrona */}
      {enviando && (
        <div className="spinner-overlay" style={{ backgroundColor: "transparent" }}>
          <div className="spinner-container">
            <Oval
              height={44}
              width={44}
              color="#0284c7"
              secondaryColor="#e0f2fe"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="verificando-respuesta"
            />
            <p className="spinner-text">Verificando tu cálculo...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuloEjercicios;
