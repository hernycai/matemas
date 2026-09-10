import { useState, useEffect, useRef } from 'react';
import ButtonContinue from '../../ui/ButtonContinue/ButtonContinue';
import { MascotWidget } from '../../../mascotas/components/MascotWidget';
import './Ejercicio.css';
import HeaderDesafio from '../Desafios/headerDesafio/HeaderDesafio';
import HeaderMate from '../HeaderMate/HeaderMate';
import { useMascotContext } from '../../../mascotas/core/MascotProvider';
import { FaCalculator, FaPen, FaLightbulb, FaBookOpen } from 'react-icons/fa';

function EjercicioInput({
  pregunta,
  imagenUrl,
  onContinue,
  onResponder,
  progreso = 0,
  mascotPosition = 'bottom-left',
  mascotSize = 160,
  maxIntentos = 3,
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
  const [inputValue, setInputValue] = useState('');
  const [resultado, setResultado] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [yaDioPista, setYaDioPista] = useState(false);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);

  const isMounted = useRef(true);
  const { say, react, setState } = useMascotContext();

  // 🎯 Dar pista después de varios intentos fallidos
  useEffect(() => {
    if (resultado === 'incorrecto' && intentos >= maxIntentos && !yaDioPista) {
      setYaDioPista(true);
      say('hint');
      setState('thinking');
      setMostrarPista(true);

      const timer = setTimeout(() => {
        if (isMounted.current) {
          setState('idle');
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (isMounted.current) {
          setState('idle');
        }
      };
    }
  }, [intentos, resultado, say, setState, yaDioPista, maxIntentos]);

  // 🔄 Resetear estado cuando cambia la pregunta
  useEffect(() => {
    isMounted.current = true;
    setInputValue('');
    setResultado(null);
    setIntentos(0);
    setYaDioPista(false);
    setRespuestaEnviada(false);
    setMostrarPista(false);
    setMostrarExplicacion(false);
    setState('idle');

    return () => {
      isMounted.current = false;
    };
  }, [pregunta, setState]);

  // Feedback desde el backend
  useEffect(() => {
    if (!ultimoResultado || !respuestaEnviada || enviando) return;
    if (!isMounted.current) return;

    if (ultimoResultado.esCorrecto) {
      setResultado('correcto');
      react('celebration', '🎉 ¡Perfecto! ¡Sos un genio!');
    } else {
      setResultado('incorrecto');
      setMostrarExplicacion(true);
      setIntentos((prev) => prev + 1);
      const mensajesError = [
        '❌ Intentalo de nuevo. ¡Vos podés!',
        '❌ Casi... ¡Revisá el número!',
        '❌ No te rindas, ¡hacé la cuenta con calma!',
        '❌ ¡Un poco más! Confío en vos.',
      ];
      const index = Math.min(intentos, mensajesError.length - 1);
      react('sad', mensajesError[index]);
      setRespuestaEnviada(false);
    }
  }, [ultimoResultado, respuestaEnviada, enviando, react, intentos]);

  // Tras acertar: dejar ver la mascota ~2.2s y después avanzar
  useEffect(() => {
    if (!enviando && respuestaEnviada && resultado === 'correcto') {
      const timer = setTimeout(() => {
        if (!isMounted.current) return;
        setRespuestaEnviada(false);
        setResultado(null);
        setInputValue('');
        setIntentos(0);
        setYaDioPista(false);
        setState('idle');
        onContinue();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [enviando, respuestaEnviada, resultado, onContinue, setState]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9$., ]*$/.test(value)) {
      setInputValue(value);
    }
  };

  const verificarRespuesta = (e) => {
    e.preventDefault();

    if (enviando || respuestaEnviada) return;

    if (!inputValue.trim()) {
      react('thinking', 'Escribí un número antes de comprobar.');
      return;
    }

    if (resultado === 'correcto') {
      return;
    }

    setResultado(null);
    setRespuestaEnviada(true);
    if (onResponder) {
      onResponder(inputValue);
    }
  };

  const handleContinue = () => {
    if (respuestaEnviada && !enviando && resultado === 'correcto') {
      setRespuestaEnviada(false);
      setResultado(null);
      setInputValue('');
      setIntentos(0);
      setYaDioPista(false);
      setState('idle');
      onContinue();
    }
  };

  const manejarPistaClick = () => {
    setMostrarPista((prev) => !prev);
    if (!mostrarPista) {
      if (onPedirPista) {
        onPedirPista();
      } else {
        react('thinking', pista || 'Fijate en la operación matemática principal (suma, resta o porcentaje).');
      }
    }
  };

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
              <FaLightbulb color="#d97706" /> {mostrarPista ? 'Ocultar Pista' : 'Pedir Pista'}
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

          <h2 className="ejercicio-pregunta-centered">{pregunta}</h2>

          {/* Globo de pista interactiva */}
          {mostrarPista && (
            <div className="explicacion-box" style={{ borderLeftColor: '#f59e0b', marginBottom: '1.5rem' }}>
              <div className="explicacion-header" style={{ color: '#b45309' }}>
                <FaLightbulb /> Pista del Tutor:
              </div>
              <p style={{ margin: 0, color: '#78350f' }}>
                {pista || 'Revisá la fórmula y hacé la cuenta con la calculadora o borrador.'}
              </p>
            </div>
          )}

          {imagenUrl && (
            <div className="card-imagen-wrapper" style={{ marginBottom: '2rem' }}>
              <img
                src={imagenUrl}
                alt="Material del ejercicio"
                className="ejercicio-imagen"
              />
            </div>
          )}

          <form onSubmit={verificarRespuesta} className="ejercicio-form" style={{ width: '100%', maxWidth: '480px' }}>
            <div className="input-container" style={{ width: '100%' }}>
              <input
                type="text"
                inputMode="decimal"
                placeholder={resultado === 'correcto' ? '✅ ¡Bien hecho!' : 'Ingresá el número exacto...'}
                value={inputValue}
                onChange={handleInputChange}
                className="ejercicio-input"
                autoFocus
                disabled={resultado === 'correcto' || enviando}
                aria-label="Respuesta al ejercicio numérico"
              />
              <button
                type="submit"
                className="button-check"
                disabled={resultado === 'correcto' || enviando || !inputValue.trim()}
              >
                {enviando ? '⏳' : resultado === 'correcto' ? '✅ Correcto' : 'Comprobar'}
              </button>
            </div>
          </form>

          <div className="feedback-wrapper" style={{ marginTop: '1.25rem' }}>
            {enviando && (
              <div className="alert-message alert-info animate-pop">
                <span>⏳ Verificando tu cálculo...</span>
              </div>
            )}
            {resultado === 'correcto' && (
              <div className="alert-message alert-success animate-pop">
                <span>
                  🎉 ¡Excelente cálculo! Tu resultado es exacto.
                  {ultimoResultado?.puntosGanados > 0 && ` (+${ultimoResultado.puntosGanados} puntos)`}
                </span>
              </div>
            )}
            {resultado === 'incorrecto' && (
              <div className="alert-message alert-danger animate-pop">
                <span>
                  💪 ¡Casi! Revisá los números e intentalo de nuevo.
                </span>
              </div>
            )}
          </div>

          {/* Explicación paso a paso didáctica */}
          {(explicacionPasoAPaso || ultimoResultado?.feedback) && (resultado === 'incorrecto' || mostrarExplicacion || resultado === 'correcto') && (
            <div className="explicacion-box">
              <div className="explicacion-header">
                <FaBookOpen color="#0284c7" /> Paso a paso:
              </div>
              <p style={{ margin: 0 }}>
                {ultimoResultado?.feedback && ultimoResultado.feedback !== 'No es el número exacto. Revisá las operaciones e intentá nuevamente.'
                  ? ultimoResultado.feedback
                  : explicacionPasoAPaso || 'Calculá paso a paso separando las cantidades.'}
              </p>
            </div>
          )}
        </div>

        <div className="ejercicio-footer">
          <ButtonContinue
            onClick={handleContinue}
            disabled={resultado !== 'correcto' || enviando}
          />
        </div>
      </main>
    </div>
  );
}

export default EjercicioInput;