/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import ButtonContinue from '../../ui/ButtonContinue/ButtonContinue';
import { MascotWidget } from '../../../mascotas/components/MascotWidget';
import './Ejercicio.css';
import HeaderDesafio from '../Desafios/headerDesafio/HeaderDesafio';
import HeaderMate from '../HeaderMate/HeaderMate';
import { useMascotContext } from '../../../mascotas/core/MascotProvider';

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
}) {
  const isMobile = window.innerWidth <= 900;
  const [inputValue, setInputValue] = useState('');
  const [resultado, setResultado] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [yaDioPista, setYaDioPista] = useState(false);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false); // ✅ Para saber si ya se envió

  const isMounted = useRef(true);
  const { say, react, setState } = useMascotContext();

  // 🎯 Dar pista después de varios intentos fallidos
  useEffect(() => {
    if (resultado === 'incorrecto' && intentos >= maxIntentos && !yaDioPista) {
      setYaDioPista(true);
      say('hint');
      setState('thinking');

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
    setInputValue('');
    setResultado(null);
    setIntentos(0);
    setYaDioPista(false);
    setRespuestaEnviada(false); // ✅ Resetear
    setState('idle');

    return () => {
      isMounted.current = false;
    };
  }, [pregunta, setState]);

  // Feedback desde el backend (la respuesta correcta no viaja al cliente)
  useEffect(() => {
    if (!ultimoResultado || !respuestaEnviada || enviando) return;
    if (!isMounted.current) return;

    if (ultimoResultado.esCorrecto) {
      setResultado('correcto');
      react('celebration', '🎉 ¡Perfecto! ¡Sos un genio!');
    } else {
      setResultado('incorrecto');
      setIntentos((prev) => prev + 1);
      const mensajesError = [
        '❌ Intentalo de nuevo. ¡Vos podés!',
        '❌ Casi... ¡Dale otra oportunidad!',
        '❌ No te rindas, ¡pensá con calma!',
        '❌ ¡Un poco más! Confío en vos.',
      ];
      const index = Math.min(intentos, mensajesError.length - 1);
      react('sad', mensajesError[index]);
      setRespuestaEnviada(false);
    }
  }, [ultimoResultado, respuestaEnviada, enviando, react, intentos]);

  // Tras acertar: dejar ver la mascota ~2s y después avanzar
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
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputValue(value);
    }
  };

  const verificarRespuesta = (e) => {
    e.preventDefault();

    if (enviando || respuestaEnviada) return;

    if (!inputValue) {
      say('thinking_prompt');
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

  // ✅ Función para avanzar manualmente (solo cuando no está cargando)
  const handleContinue = () => {
    // Si ya se envió la respuesta y el backend ya respondió
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

        <div className="ejercicio-grid">
          <div className="ejercicio-col-left">
            <h2 className="ejercicio-pregunta">{pregunta}</h2>

            <form onSubmit={verificarRespuesta} className="ejercicio-form">
              <div className="input-container">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={resultado === 'correcto' ? '✅ ¡Bien hecho!' : 'Escribí tu respuesta...'}
                  value={inputValue}
                  onChange={handleInputChange}
                  className={`ejercicio-input ${resultado === 'correcto' ? 'ejercicio-input--success' : ''}`}
                  autoFocus
                  disabled={resultado === 'correcto' || enviando}
                />
                <button
                  type="submit"
                  className={`button-check ${resultado === 'correcto' || enviando ? 'button-check--disabled' : ''}`}
                  disabled={resultado === 'correcto' || enviando}
                >
                  {enviando ? '⏳' : resultado === 'correcto' ? '✅' : 'Comprobar'}
                </button>
              </div>
            </form>
          </div>

          <div className="ejercicio-col-right">
            <div className="card-imagen-wrapper">
              <img
                src={imagenUrl}
                alt="Material del ejercicio"
                className="ejercicio-imagen"
              />
            </div>
          </div>
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