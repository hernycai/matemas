import { useState, useEffect, useRef } from "react";
import ButtonContinue from "../../ui/ButtonContinue/ButtonContinue";
import "./Ejercicio.css";
import HeaderDesafio from "../Desafios/headerDesafio/HeaderDesafio";
import HeaderMate from "../HeaderMate/HeaderMate";
import { MascotWidget } from "../../../mascotas/components/MascotWidget";
import { useMascotContext } from "../../../mascotas/core/MascotProvider";
import { FaCalculator, FaPen, FaLightbulb, FaBookOpen } from "react-icons/fa";

const FEEDBACK_CORRECTO_MS = 2500;

function EjercicioChoice({
  pregunta,
  imagenUrl,
  opciones = [],
  onContinue,
  onResponder,
  progreso = 0,
  mascotPosition = "bottom-left",
  mascotSize = 160,
  enviando = false,
  ultimoResultado = null,
  seccionId = null,
  onOpenCalculadora = null,
  onOpenPizarra = null,
  onPedirPista = null,
  rondaInfo = null,
  explicacionPasoAPaso = null,
  pista = null,
}) {
  const isMobile = window.innerWidth <= 900;
  const datosChoiceDePrueba = {
    pregunta: "¿Cuánto es el 25% de 300?",
    opciones: [
      { id: 201, texto: "75", esCorrecta: true },
      { id: 202, texto: "100", esCorrecta: false },
      { id: 203, texto: "50", esCorrecta: false },
    ],
  };

  const preguntaActual = pregunta || datosChoiceDePrueba.pregunta;
  const opcionesActuales = opciones.length
    ? opciones
    : datosChoiceDePrueba.opciones;

  const [seleccionado, setSeleccionado] = useState(null);
  const [esCorrecto, setEsCorrecto] = useState(null);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const { react, setState } = useMascotContext();
  const avanceTimer = useRef(null);

  useEffect(() => {
    setSeleccionado(null);
    setEsCorrecto(null);
    setMostrarPista(false);
    setMostrarExplicacion(false);
    setState("idle");
    if (avanceTimer.current) {
      clearTimeout(avanceTimer.current);
      avanceTimer.current = null;
    }
  }, [preguntaActual, setState]);

  useEffect(() => {
    return () => {
      if (avanceTimer.current) clearTimeout(avanceTimer.current);
    };
  }, []);

  // Feedback del backend + desbloqueo / avance
  useEffect(() => {
    if (!ultimoResultado || seleccionado == null || enviando) return;

    const correcto = Boolean(ultimoResultado.esCorrecto);
    setEsCorrecto(correcto);

    if (correcto) {
      react("celebration", "¡Excelente! Elegiste la opción correcta.");
      if (avanceTimer.current) clearTimeout(avanceTimer.current);
      avanceTimer.current = setTimeout(() => {
        setSeleccionado(null);
        setEsCorrecto(null);
        setState("idle");
        onContinue();
      }, FEEDBACK_CORRECTO_MS);
    } else {
      react("sad", "Casi. Revisá los cálculos, ¡vos podés!");
      setMostrarExplicacion(true);
    }
  }, [ultimoResultado, seleccionado, enviando, react, onContinue, setState]);

  const manejarSeleccion = (opcion) => {
    if (enviando || esCorrecto === true) return;

    if (avanceTimer.current) {
      clearTimeout(avanceTimer.current);
      avanceTimer.current = null;
    }

    setSeleccionado(opcion.id);
    setEsCorrecto(null);

    if (onResponder) {
      onResponder(opcion.id, opcion);
    }
  };

  const manejarPistaClick = () => {
    setMostrarPista((prev) => !prev);
    if (!mostrarPista) {
      if (onPedirPista) {
        onPedirPista();
      } else {
        react("thinking", pista || "Pensá en dividir el número en partes fáciles o usar regla de tres.");
      }
    }
  };

  const feedbackCorrecto =
    esCorrecto === true || ultimoResultado?.esCorrecto === true;
  const feedbackIncorrecto =
    esCorrecto === false ||
    (ultimoResultado &&
      ultimoResultado.esCorrecto === false &&
      seleccionado != null &&
      !enviando);

  return (
    <div className="ejercicio-page-container">
      <MascotWidget
        size={isMobile ? 90 : mascotSize}
        position={mascotPosition}
        showBubble={true}
      />

      <main className="ejercicio-page-content">
        <HeaderMate />
        <HeaderDesafio progreso={progreso} seccionId={seccionId} />

        {/* Barra de utilidades pedagógicas */}
        <div className="ejercicio-tools-bar">
          {onOpenCalculadora && (
            <button
              type="button"
              className="tool-badge-btn"
              onClick={onOpenCalculadora}
              title="Abrir Calculadora rápida"
            >
              <FaCalculator color="#0284c7" /> Calculadora
            </button>
          )}

          {onOpenPizarra && (
            <button
              type="button"
              className="tool-badge-btn"
              onClick={onOpenPizarra}
              title="Abrir hoja de borrador para hacer cuentas a mano"
            >
              <FaPen color="#059669" /> Pizarra Borrador
            </button>
          )}

          {(pista || onPedirPista) && (
            <button
              type="button"
              className="tool-badge-btn hint-btn"
              onClick={manejarPistaClick}
              title="Pedir una pista a tu tutor"
            >
              <FaLightbulb color="#d97706" /> {mostrarPista ? "Ocultar Pista" : "Pedir Pista"}
            </button>
          )}
        </div>

        {/* Tarjeta contenedora con aislamiento de contraste */}
        <div className="ejercicio-card-shell">
          {rondaInfo && (
            <div className="ronda-chip">
              Pregunta {rondaInfo.actual} de {rondaInfo.total}
            </div>
          )}

          <h2 className="ejercicio-pregunta-centered">{preguntaActual}</h2>

          {/* Globo de pista interactiva */}
          {mostrarPista && (
            <div className="explicacion-box" style={{ borderLeftColor: "#f59e0b", marginBottom: "1.5rem" }}>
              <div className="explicacion-header" style={{ color: "#b45309" }}>
                <FaLightbulb /> Pista del Tutor:
              </div>
              <p style={{ margin: 0, color: "#78350f" }}>
                {pista || "Analizá qué porcentaje u operación se pide y calculá por partes."}
              </p>
            </div>
          )}

          {imagenUrl && (
            <div
              className="card-imagen-wrapper"
              style={{ marginBottom: "2rem" }}
            >
              <img
                src={imagenUrl}
                alt="Material del ejercicio"
                className="ejercicio-imagen"
              />
            </div>
          )}

          <div className="options-grid">
            {opcionesActuales.map((opcion) => {
              let buttonClass = "option-button";

              if (seleccionado === opcion.id) {
                if (enviando && esCorrecto == null) {
                  buttonClass += " option-loading";
                } else if (feedbackCorrecto && seleccionado === opcion.id) {
                  buttonClass += " option-correct";
                } else if (feedbackIncorrecto && seleccionado === opcion.id) {
                  buttonClass += " option-incorrect";
                }
              }

              return (
                <button
                  key={opcion.id}
                  className={buttonClass}
                  onClick={() => manejarSeleccion(opcion)}
                  type="button"
                  disabled={enviando || esCorrecto === true}
                >
                  {seleccionado === opcion.id && enviando && esCorrecto == null
                    ? "⏳ Verificando..."
                    : opcion.texto}
                </button>
              );
            })}
          </div>

          <div className="feedback-wrapper">
            {enviando && esCorrecto == null && (
              <div className="alert-message alert-info animate-pop">
                <span>⏳ Verificando tu respuesta...</span>
              </div>
            )}
            {feedbackCorrecto && (
              <div className="alert-message alert-success animate-pop">
                <span>
                  🎉 ¡Excelente trabajo! Respuesta correcta.
                  {ultimoResultado?.puntosGanados > 0 &&
                    ` (+${ultimoResultado.puntosGanados} puntos)`}
                </span>
              </div>
            )}
            {feedbackIncorrecto && !feedbackCorrecto && (
              <div className="alert-message alert-danger animate-pop">
                <span>
                  💪 ¡Casi! Elegí otra opción e intentá de nuevo.
                </span>
              </div>
            )}
          </div>

          {/* Explicación paso a paso didáctica */}
          {(explicacionPasoAPaso || ultimoResultado?.feedback) && (feedbackIncorrecto || mostrarExplicacion || feedbackCorrecto) && (
            <div className="explicacion-box">
              <div className="explicacion-header">
                <FaBookOpen color="#0284c7" /> Paso a paso:
              </div>
              <p style={{ margin: 0 }}>
                {ultimoResultado?.feedback && ultimoResultado.feedback !== "Casi... Revisá el cálculo e intentalo de nuevo."
                  ? ultimoResultado.feedback
                  : explicacionPasoAPaso || "Revisá los datos planteados y aplicá la fórmula paso a paso."}
              </p>
            </div>
          )}
        </div>

        <div className="ejercicio-footer">
          <ButtonContinue
            onClick={onContinue}
            disabled={esCorrecto !== true || enviando}
          />
        </div>
      </main>
    </div>
  );
}

export default EjercicioChoice;
