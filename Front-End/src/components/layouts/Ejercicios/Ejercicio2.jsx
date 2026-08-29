/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import ButtonContinue from "../../ui/ButtonContinue/ButtonContinue";
import "./Ejercicio.css";
import HeaderDesafio from "../Desafios/headerDesafio/HeaderDesafio";
import HeaderMate from "../HeaderMate/HeaderMate";
import { MascotWidget } from "../../../mascotas/components/MascotWidget";
import { useMascotContext } from "../../../mascotas/core/MascotProvider";

const FEEDBACK_CORRECTO_MS = 2200;

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
}) {
  const isMobile = window.innerWidth <= 900;
  const datosChoiceDePrueba = {
    pregunta: "¿Cuánto es el 25% de 300?",
    opciones: [
      { id: -1, texto: "75" },
      { id: -2, texto: "100" },
      { id: -3, texto: "50" },
    ],
  };

  const preguntaActual = pregunta || datosChoiceDePrueba.pregunta;
  const opcionesActuales = opciones.length
    ? opciones
    : datosChoiceDePrueba.opciones;

  const [seleccionado, setSeleccionado] = useState(null);
  const [esCorrecto, setEsCorrecto] = useState(null);
  const { react, setState } = useMascotContext();
  const avanceTimer = useRef(null);

  useEffect(() => {
    setSeleccionado(null);
    setEsCorrecto(null);
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
      react("sad", "Casi. Volvé a intentarlo, vos podés.");
      // Permite elegir otra opción de inmediato (no bloqueamos el estado)
    }
  }, [ultimoResultado, seleccionado, enviando, react, onContinue, setState]);

  const manejarSeleccion = (opcion) => {
    // Solo bloquear mientras envía o si ya acertó (esperando avanzar)
    if (enviando || esCorrecto === true) return;

    if (avanceTimer.current) {
      clearTimeout(avanceTimer.current);
      avanceTimer.current = null;
    }

    setSeleccionado(opcion.id);
    setEsCorrecto(null);

    // La corrección la define el backend (no enviamos esCorrecta al cliente).
    if (onResponder) {
      onResponder(opcion.id);
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

        <div className="ejercicio-choice-container">
          <h2 className="ejercicio-pregunta-centered">{preguntaActual}</h2>

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
                    ? "⏳"
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
                  🎉 ¡Excelente trabajo! Respuesta correcta. ¡Seguí así!
                  {ultimoResultado?.puntosGanados > 0 &&
                    ` (+${ultimoResultado.puntosGanados} puntos)`}
                </span>
              </div>
            )}
            {feedbackIncorrecto && !feedbackCorrecto && (
              <div className="alert-message alert-danger animate-pop">
                <span>
                  💪 ¡Casi! Elegí otra opción e intentá de nuevo.
                  {ultimoResultado?.feedback
                    ? ` ${ultimoResultado.feedback}`
                    : ""}
                </span>
              </div>
            )}
          </div>
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
