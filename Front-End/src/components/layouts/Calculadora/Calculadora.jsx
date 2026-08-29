import React, { useState, useEffect, useCallback } from 'react';
import './calculadora.css';
import {
  FaCalculator,
  FaTag,
  FaUsers,
  FaCreditCard,
  FaBalanceScale,
  FaExchangeAlt,
  FaCopy,
  FaCheck,
  FaBackspace,
  FaHistory
} from 'react-icons/fa';

export default function ModalCalculadora({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('basica'); // 'basica', 'descuentos', 'cuenta', 'cuotas', 'comparador', 'regla3'
  const [copied, setCopied] = useState(false);

  // --- Estado de la Calculadora Básica ---
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [history, setHistory] = useState([]);
  const [expression, setExpression] = useState('');

  // --- Estado: Descuentos ---
  const [descPrecio, setDescPrecio] = useState('');
  const [descPorcentaje, setDescPorcentaje] = useState(15);

  // --- Estado: Cuenta y Propina ---
  const [cuentaTotal, setCuentaTotal] = useState('');
  const [propinaPct, setPropinaPct] = useState(10);
  const [comensales, setComensales] = useState(2);

  // --- Estado: Cuotas ---
  const [cuotaContado, setCuotaContado] = useState('');
  const [numCuotas, setNumCuotas] = useState(3);
  const [montoPorCuota, setMontoPorCuota] = useState('');

  // --- Estado: Comparador Supermercado ---
  const [compPrecioA, setCompPrecioA] = useState('');
  const [compCantA, setCompCantA] = useState('');
  const [compUnidadA, setCompUnidadA] = useState('g');
  const [compPrecioB, setCompPrecioB] = useState('');
  const [compCantB, setCompCantB] = useState('');
  const [compUnidadB, setCompUnidadB] = useState('g');

  // --- Estado: Regla de Tres ---
  const [reglaA, setReglaA] = useState('');
  const [reglaB, setReglaB] = useState('');
  const [reglaC, setReglaC] = useState('');

  // --- Manejo de la Calculadora Básica ---
  const handleDigit = useCallback((digit) => {
    if (overwrite || display === '0') {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      if (display.length < 14) {
        setDisplay(display + digit);
      }
    }
  }, [display, overwrite]);

  const handleDecimal = useCallback(() => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, overwrite]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(false);
    setExpression('');
  }, []);

  const handleBackspace = useCallback(() => {
    if (overwrite) {
      setDisplay('0');
      setOverwrite(false);
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, overwrite]);

  const handleToggleSign = useCallback(() => {
    if (display === '0') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  }, [display]);

  const calculateResult = (a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return numB;
    switch (op) {
      case '+':
        return numA + numB;
      case '−':
      case '-':
        return numA - numB;
      case '×':
      case '*':
        return numA * numB;
      case '÷':
      case '/':
        if (numB === 0) return 'Error';
        return numA / numB;
      default:
        return numB;
    }
  };

  const handleOperation = useCallback((op) => {
    const current = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(current);
      setOperation(op);
      setExpression(`${display} ${op}`);
      setOverwrite(true);
    } else if (operation && !overwrite) {
      const res = calculateResult(prevValue, current, operation);
      if (res === 'Error') {
        setDisplay('Error (÷0)');
        setPrevValue(null);
        setOperation(null);
        setOverwrite(true);
        return;
      }
      const rounded = Math.round(res * 100000000) / 100000000;
      setDisplay(String(rounded));
      setPrevValue(rounded);
      setOperation(op);
      setExpression(`${rounded} ${op}`);
      setOverwrite(true);
    } else {
      setOperation(op);
      setExpression(`${prevValue} ${op}`);
    }
  }, [display, prevValue, operation, overwrite]);

  const handleEqual = useCallback(() => {
    if (prevValue === null || operation === null) return;
    const current = parseFloat(display);
    const res = calculateResult(prevValue, current, operation);

    if (res === 'Error') {
      setDisplay('Error (÷0)');
      setPrevValue(null);
      setOperation(null);
      setOverwrite(true);
      return;
    }

    const rounded = Math.round(res * 100000000) / 100000000;
    const fullExpr = `${prevValue} ${operation} ${current} = ${rounded}`;
    setHistory((prev) => [fullExpr, ...prev.slice(0, 9)]);
    setExpression(`${prevValue} ${operation} ${current} =`);
    setDisplay(String(rounded));
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  }, [prevValue, operation, display]);

  // Listener para teclado físico
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperation('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperation('−');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleDecimal, handleOperation, handleEqual, handleBackspace, onClose]);

  // Porcentaje inteligente cotidiano (ej: 1000 + 20% -> 1200, 1000 - 15% -> 850, 500 * 10% -> 50)
  const handlePercent = useCallback(() => {
    const current = parseFloat(display);
    if (isNaN(current)) return;

    if (prevValue !== null && operation !== null) {
      let percentValue = 0;
      if (operation === '+' || operation === '−' || operation === '-') {
        percentValue = (prevValue * current) / 100;
      } else {
        percentValue = current / 100;
      }
      const res = calculateResult(prevValue, percentValue, operation);
      const rounded = Math.round(res * 100000000) / 100000000;
      const fullExpr = `${prevValue} ${operation} ${current}% = ${rounded}`;
      setHistory((prev) => [fullExpr, ...prev.slice(0, 9)]);
      setExpression(fullExpr);
      setDisplay(String(rounded));
      setPrevValue(null);
      setOperation(null);
      setOverwrite(true);
    } else {
      const val = current / 100;
      setDisplay(String(val));
      setOverwrite(true);
    }
  }, [display, prevValue, operation]);

  // Atajos de teclado en modo Básica
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Ignorar si el usuario está escribiendo en un input de otra pestaña
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperation('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperation('−');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (display !== '0') {
          handleClear();
        } else {
          onClose();
        }
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleDecimal, handleOperation, handleEqual, handleBackspace, handleClear, handlePercent, display, onClose]);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // --- Cálculos de Herramientas Cotidianas ---
  // 1. Descuentos
  const numPrecio = parseFloat(descPrecio) || 0;
  const ahorroDesc = (numPrecio * (parseFloat(descPorcentaje) || 0)) / 100;
  const precioFinalDesc = Math.max(0, numPrecio - ahorroDesc);

  // 2. Cuenta y Propina
  const numCuenta = parseFloat(cuentaTotal) || 0;
  const montoPropina = (numCuenta * (parseFloat(propinaPct) || 0)) / 100;
  const totalConPropina = numCuenta + montoPropina;
  const numGente = Math.max(1, parseInt(comensales, 10) || 1);
  const porPersona = totalConPropina / numGente;

  // 3. Cuotas y Recargo
  const numContado = parseFloat(cuotaContado) || 0;
  const numCuotasVal = Math.max(1, parseInt(numCuotas, 10) || 1);
  const numMontoCuota = parseFloat(montoPorCuota) || 0;
  const totalFinanciado = numMontoCuota * numCuotasVal;
  const recargoTotal = totalFinanciado > numContado ? totalFinanciado - numContado : 0;
  const recargoPct = numContado > 0 ? (recargoTotal / numContado) * 100 : 0;

  // 4. Comparador de Precios
  const getNormalizedUnit = (cant, unidad) => {
    const c = parseFloat(cant) || 0;
    if (c <= 0) return 0;
    if (unidad === 'g') return c / 1000; // a kg
    if (unidad === 'kg') return c;
    if (unidad === 'ml') return c / 1000; // a L
    if (unidad === 'l') return c;
    return c; // unid
  };
  const normA = getNormalizedUnit(compCantA, compUnidadA);
  const normB = getNormalizedUnit(compCantB, compUnidadB);
  const unitPriceA = normA > 0 && parseFloat(compPrecioA) > 0 ? parseFloat(compPrecioA) / normA : 0;
  const unitPriceB = normB > 0 && parseFloat(compPrecioB) > 0 ? parseFloat(compPrecioB) / normB : 0;

  let compResultado = null;
  if (unitPriceA > 0 && unitPriceB > 0) {
    if (unitPriceA < unitPriceB) {
      const diffPct = Math.round(((unitPriceB - unitPriceA) / unitPriceB) * 100);
      compResultado = {
        ganador: 'A',
        ahorro: diffPct,
        texto: `¡La Opción A es ${diffPct}% más económica por unidad/kg/litro!`
      };
    } else if (unitPriceB < unitPriceA) {
      const diffPct = Math.round(((unitPriceA - unitPriceB) / unitPriceA) * 100);
      compResultado = {
        ganador: 'B',
        ahorro: diffPct,
        texto: `¡La Opción B es ${diffPct}% más económica por unidad/kg/litro!`
      };
    } else {
      compResultado = {
        ganador: 'IGUAL',
        ahorro: 0,
        texto: 'Ambas opciones tienen exactamente el mismo precio unitario.'
      };
    }
  }

  // 5. Regla de Tres
  const valA = parseFloat(reglaA);
  const valB = parseFloat(reglaB);
  const valC = parseFloat(reglaC);
  const reglaResultado = !isNaN(valA) && !isNaN(valB) && !isNaN(valC) && valA !== 0
    ? (valC * valB) / valA
    : null;

  if (!isOpen) return null;

  return (
    <div className="modal-ayuda-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Calculadora Cotidiana">
      <div className="modal-calculadora-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="calc-header">
          <div className="calc-header-title">
            <div className="calc-header-icon">
              <FaCalculator />
            </div>
            <div>
              <h3>Calculadora Cotidiana</h3>
              <p>Herramientas matemáticas para tus decisiones del día a día</p>
            </div>
          </div>

          <button className="calc-close-btn" onClick={onClose} aria-label="Cerrar calculadora" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="calc-nav-tabs" aria-label="Modos de la calculadora">
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'basica' ? 'active' : ''}`}
            onClick={() => setActiveTab('basica')}
          >
            <FaCalculator />
            <span>Básica</span>
          </button>
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'descuentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('descuentos')}
          >
            <FaTag />
            <span>Descuentos</span>
          </button>
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'cuenta' ? 'active' : ''}`}
            onClick={() => setActiveTab('cuenta')}
          >
            <FaUsers />
            <span>Cuenta & Propina</span>
          </button>
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'cuotas' ? 'active' : ''}`}
            onClick={() => setActiveTab('cuotas')}
          >
            <FaCreditCard />
            <span>Cuotas & Interés</span>
          </button>
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'comparador' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparador')}
          >
            <FaBalanceScale />
            <span>Comparar Precios</span>
          </button>
          <button
            type="button"
            className={`calc-tab-btn ${activeTab === 'regla3' ? 'active' : ''}`}
            onClick={() => setActiveTab('regla3')}
          >
            <FaExchangeAlt />
            <span>Regla de 3</span>
          </button>
        </nav>

        {/* Contenido según pestaña */}
        <div className="calc-body">
          {/* --- MODO 1: CALCULADORA BÁSICA --- */}
          {activeTab === 'basica' && (
            <div className="calc-basica-wrapper">
              {/* Display de la calculadora */}
              <div className="calc-display-box">
                <div className="calc-display-expression">{expression || '\u00A0'}</div>
                <div className="calc-display-main">
                  <span className="calc-display-digits">{display}</span>
                  <button
                    type="button"
                    className="calc-copy-btn"
                    onClick={() => copyToClipboard(display)}
                    title="Copiar resultado"
                    aria-label="Copiar resultado"
                  >
                    {copied ? <FaCheck color="#10B981" /> : <FaCopy />}
                  </button>
                </div>
              </div>

              {/* Botones de Presets Cotidianos */}
              <div className="calc-presets-row">
                <button
                  type="button"
                  className="calc-preset-chip"
                  onClick={() => {
                    const current = parseFloat(display) || 0;
                    const res = Math.round(current * 1.21 * 100) / 100;
                    setExpression(`${current} + 21% IVA =`);
                    setDisplay(String(res));
                    setOverwrite(true);
                  }}
                  title="Sumar 21% de IVA"
                >
                  +21% IVA
                </button>
                <button
                  type="button"
                  className="calc-preset-chip"
                  onClick={() => {
                    const current = parseFloat(display) || 0;
                    const res = Math.round(current * 0.9 * 100) / 100;
                    setExpression(`${current} - 10% Off =`);
                    setDisplay(String(res));
                    setOverwrite(true);
                  }}
                  title="Aplicar 10% de descuento"
                >
                  -10% Off
                </button>
                <button
                  type="button"
                  className="calc-preset-chip"
                  onClick={() => {
                    const current = parseFloat(display) || 0;
                    const res = Math.round(current * 0.8 * 100) / 100;
                    setExpression(`${current} - 20% Off =`);
                    setDisplay(String(res));
                    setOverwrite(true);
                  }}
                  title="Aplicar 20% de descuento"
                >
                  -20% Off
                </button>
                <button
                  type="button"
                  className="calc-preset-chip"
                  onClick={() => {
                    const current = parseFloat(display) || 0;
                    const res = Math.round((current / 2) * 100) / 100;
                    setExpression(`${current} ÷ 2 (Mitad) =`);
                    setDisplay(String(res));
                    setOverwrite(true);
                  }}
                  title="Dividir a la mitad"
                >
                  ½ Mitad
                </button>
              </div>

              {/* Teclado numérico y operacional */}
              <div className="calc-keypad-grid">
                <button type="button" className="calc-key key-function" onClick={handleClear}>
                  C
                </button>
                <button type="button" className="calc-key key-function" onClick={handleBackspace} aria-label="Borrar último dígito">
                  <FaBackspace />
                </button>
                <button type="button" className="calc-key key-function" onClick={handleToggleSign}>
                  ±
                </button>
                <button type="button" className="calc-key key-operator" onClick={handlePercent}>
                  %
                </button>

                <button type="button" className="calc-key key-number" onClick={() => handleDigit('7')}>
                  7
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('8')}>
                  8
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('9')}>
                  9
                </button>
                <button type="button" className="calc-key key-operator" onClick={() => handleOperation('÷')}>
                  ÷
                </button>

                <button type="button" className="calc-key key-number" onClick={() => handleDigit('4')}>
                  4
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('5')}>
                  5
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('6')}>
                  6
                </button>
                <button type="button" className="calc-key key-operator" onClick={() => handleOperation('×')}>
                  ×
                </button>

                <button type="button" className="calc-key key-number" onClick={() => handleDigit('1')}>
                  1
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('2')}>
                  2
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('3')}>
                  3
                </button>
                <button type="button" className="calc-key key-operator" onClick={() => handleOperation('−')}>
                  −
                </button>

                <button type="button" className="calc-key key-number" onClick={() => handleDigit('0')}>
                  0
                </button>
                <button type="button" className="calc-key key-number" onClick={() => handleDigit('00')}>
                  00
                </button>
                <button type="button" className="calc-key key-number" onClick={handleDecimal}>
                  .
                </button>
                <button type="button" className="calc-key key-operator" onClick={() => handleOperation('+')}>
                  +
                </button>
              </div>

              <button type="button" className="calc-key-equal" onClick={handleEqual}>
                =
              </button>

              {/* Historial Reciente */}
              {history.length > 0 && (
                <div className="calc-history-box">
                  <div className="calc-history-title">
                    <FaHistory size={12} />
                    <span>Últimas operaciones:</span>
                  </div>
                  <div className="calc-history-list">
                    {history.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="calc-history-item">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- MODO 2: DESCUENTOS Y OFERTAS --- */}
          {activeTab === 'descuentos' && (
            <div className="tool-form-wrapper">
              <div className="tool-card-input">
                <label className="tool-label" htmlFor="desc-precio">
                  Precio Original ($):
                </label>
                <div className="tool-input-group">
                  <span className="tool-input-prefix">$</span>
                  <input
                    id="desc-precio"
                    type="number"
                    min="0"
                    placeholder="Ej. 15000"
                    className="tool-input"
                    value={descPrecio}
                    onChange={(e) => setDescPrecio(e.target.value)}
                  />
                </div>

                <label className="tool-label" style={{ marginTop: '1rem' }} htmlFor="desc-pct">
                  Porcentaje de Descuento (%):
                </label>
                <div className="tool-chips-row">
                  {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`tool-chip ${descPorcentaje === pct ? 'active' : ''}`}
                      onClick={() => setDescPorcentaje(pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="tool-input-group" style={{ marginTop: '0.5rem' }}>
                  <input
                    id="desc-pct"
                    type="number"
                    min="0"
                    max="100"
                    className="tool-input"
                    value={descPorcentaje}
                    onChange={(e) => setDescPorcentaje(e.target.value)}
                  />
                  <span className="tool-input-suffix">%</span>
                </div>
              </div>

              {numPrecio > 0 && (
                <div className="tool-result-card result-card-success">
                  <div className="tool-result-row">
                    <span className="tool-result-label">Precio Final a Pagar:</span>
                    <span className="tool-result-value highlight-green">
                      ${precioFinalDesc.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="tool-result-row" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.6rem' }}>
                    <span className="tool-result-label">Te Ahorrás:</span>
                    <span className="tool-result-saving">
                      ${ahorroDesc.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ({descPorcentaje}%)
                    </span>
                  </div>
                  <p className="tool-result-tip">
                    💡 <strong>Cálculo rápido mental:</strong> Multiplicá el precio por {(100 - descPorcentaje) / 100}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* --- MODO 3: CUENTA Y PROPINA --- */}
          {activeTab === 'cuenta' && (
            <div className="tool-form-wrapper">
              <div className="tool-card-input">
                <label className="tool-label" htmlFor="cuenta-total">
                  Total de la Cuenta ($):
                </label>
                <div className="tool-input-group">
                  <span className="tool-input-prefix">$</span>
                  <input
                    id="cuenta-total"
                    type="number"
                    min="0"
                    placeholder="Ej. 45000"
                    className="tool-input"
                    value={cuentaTotal}
                    onChange={(e) => setCuentaTotal(e.target.value)}
                  />
                </div>

                <label className="tool-label" style={{ marginTop: '1rem' }}>
                  Porcentaje de Propina Sugerida:
                </label>
                <div className="tool-chips-row">
                  {[0, 10, 12, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`tool-chip ${propinaPct === pct ? 'active' : ''}`}
                      onClick={() => setPropinaPct(pct)}
                    >
                      {pct === 0 ? 'Sin propina (0%)' : `${pct}%`}
                    </button>
                  ))}
                </div>

                <label className="tool-label" style={{ marginTop: '1rem' }} htmlFor="comensales-cant">
                  Cantidad de Personas a Dividir:
                </label>
                <div className="tool-counter-row">
                  <button
                    type="button"
                    className="tool-counter-btn"
                    onClick={() => setComensales(Math.max(1, comensales - 1))}
                  >
                    -
                  </button>
                  <input
                    id="comensales-cant"
                    type="number"
                    min="1"
                    className="tool-counter-input"
                    value={comensales}
                    onChange={(e) => setComensales(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                  <button
                    type="button"
                    className="tool-counter-btn"
                    onClick={() => setComensales(comensales + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {numCuenta > 0 && (
                <div className="tool-result-card result-card-blue">
                  <div className="tool-result-row main-highlight">
                    <span className="tool-result-label">Cada Persona Paga:</span>
                    <span className="tool-result-value highlight-blue">
                      ${Math.round(porPersona * 100) / 100 > 0 ? (porPersona).toLocaleString('es-AR', { maximumFractionDigits: 2 }) : '0'}
                    </span>
                  </div>
                  <div className="tool-result-grid-2">
                    <div>
                      <span className="tool-mini-label">Propina Total:</span>
                      <span className="tool-mini-val">${montoPropina.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="tool-mini-label">Total c/ Propina:</span>
                      <span className="tool-mini-val">${totalConPropina.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- MODO 4: CUOTAS Y RECARGO --- */}
          {activeTab === 'cuotas' && (
            <div className="tool-form-wrapper">
              <div className="tool-card-input">
                <label className="tool-label" htmlFor="cuota-contado">
                  Precio de Contado ($):
                </label>
                <div className="tool-input-group">
                  <span className="tool-input-prefix">$</span>
                  <input
                    id="cuota-contado"
                    type="number"
                    min="0"
                    placeholder="Ej. 60000"
                    className="tool-input"
                    value={cuotaContado}
                    onChange={(e) => setCuotaContado(e.target.value)}
                  />
                </div>

                <label className="tool-label" style={{ marginTop: '1rem' }}>
                  Cantidad de Cuotas:
                </label>
                <div className="tool-chips-row">
                  {[2, 3, 6, 9, 12, 18, 24].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`tool-chip ${numCuotas === c ? 'active' : ''}`}
                      onClick={() => setNumCuotas(c)}
                    >
                      {c} cuotas
                    </button>
                  ))}
                </div>

                <label className="tool-label" style={{ marginTop: '1rem' }} htmlFor="cuota-monto">
                  Valor de Cada Cuota ($):
                </label>
                <div className="tool-input-group">
                  <span className="tool-input-prefix">$</span>
                  <input
                    id="cuota-monto"
                    type="number"
                    min="0"
                    placeholder="Ej. 24000"
                    className="tool-input"
                    value={montoPorCuota}
                    onChange={(e) => setMontoPorCuota(e.target.value)}
                  />
                </div>
              </div>

              {numContado > 0 && numMontoCuota > 0 && (
                <div className={`tool-result-card ${recargoTotal === 0 ? 'result-card-success' : 'result-card-warning'}`}>
                  <div className="tool-result-row">
                    <span className="tool-result-label">Total en Cuotas:</span>
                    <span className="tool-result-value">
                      ${totalFinanciado.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="tool-result-row" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.6rem' }}>
                    <span className="tool-result-label">Recargo / Interés Total:</span>
                    <span className={`tool-result-saving ${recargoTotal > 0 ? 'text-danger' : 'text-success'}`}>
                      {recargoTotal === 0
                        ? '¡0% de recargo (Cuotas sin interés reales!)'
                        : `+$${recargoTotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })} (+${recargoPct.toFixed(1)}%)`}
                    </span>
                  </div>

                  {recargoTotal > 0 && (
                    <p className="tool-result-tip">
                      💡 Pagás un <strong>+{recargoPct.toFixed(1)}% extra</strong> por financiar en {numCuotas} pagos. Compará con la inflación estimada para decidir.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- MODO 5: COMPARADOR DE SUPERMERCADO --- */}
          {activeTab === 'comparador' && (
            <div className="tool-form-wrapper">
              <p className="tool-subtitle-help">
                Descubrí cuál producto rinde más por kilo, litro o unidad para ahorrar en el supermercado.
              </p>

              <div className="tool-compare-grid">
                {/* Opción A */}
                <div className="tool-compare-box">
                  <h4 className="compare-title title-a">Opción A</h4>
                  <label className="tool-label-sm">Precio ($):</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej. 1200"
                    className="tool-input-sm"
                    value={compPrecioA}
                    onChange={(e) => setCompPrecioA(e.target.value)}
                  />
                  <label className="tool-label-sm" style={{ marginTop: '0.4rem' }}>
                    Cantidad:
                  </label>
                  <div className="tool-unit-group">
                    <input
                      type="number"
                      min="0"
                      placeholder="Ej. 400"
                      className="tool-input-sm"
                      value={compCantA}
                      onChange={(e) => setCompCantA(e.target.value)}
                    />
                    <select
                      className="tool-select-sm"
                      value={compUnidadA}
                      onChange={(e) => setCompUnidadA(e.target.value)}
                    >
                      <option value="g">Gramos (g)</option>
                      <option value="kg">Kilos (kg)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="l">Litros (L)</option>
                      <option value="u">Unidades</option>
                    </select>
                  </div>
                  {unitPriceA > 0 && (
                    <div className="compare-unit-price">
                      ${unitPriceA.toFixed(2)} por {compUnidadA === 'g' || compUnidadA === 'kg' ? 'kg' : compUnidadA === 'ml' || compUnidadA === 'l' ? 'L' : 'unid'}
                    </div>
                  )}
                </div>

                {/* Opción B */}
                <div className="tool-compare-box">
                  <h4 className="compare-title title-b">Opción B</h4>
                  <label className="tool-label-sm">Precio ($):</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej. 2500"
                    className="tool-input-sm"
                    value={compPrecioB}
                    onChange={(e) => setCompPrecioB(e.target.value)}
                  />
                  <label className="tool-label-sm" style={{ marginTop: '0.4rem' }}>
                    Cantidad:
                  </label>
                  <div className="tool-unit-group">
                    <input
                      type="number"
                      min="0"
                      placeholder="Ej. 1"
                      className="tool-input-sm"
                      value={compCantB}
                      onChange={(e) => setCompCantB(e.target.value)}
                    />
                    <select
                      className="tool-select-sm"
                      value={compUnidadB}
                      onChange={(e) => setCompUnidadB(e.target.value)}
                    >
                      <option value="kg">Kilos (kg)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="l">Litros (L)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="u">Unidades</option>
                    </select>
                  </div>
                  {unitPriceB > 0 && (
                    <div className="compare-unit-price">
                      ${unitPriceB.toFixed(2)} por {compUnidadB === 'g' || compUnidadB === 'kg' ? 'kg' : compUnidadB === 'ml' || compUnidadB === 'l' ? 'L' : 'unid'}
                    </div>
                  )}
                </div>
              </div>

              {compResultado && (
                <div className="tool-result-card result-card-success" style={{ marginTop: '1rem' }}>
                  <p className="compare-verdict-title">{compResultado.texto}</p>
                </div>
              )}
            </div>
          )}

          {/* --- MODO 6: REGLA DE TRES SIMPLE --- */}
          {activeTab === 'regla3' && (
            <div className="tool-form-wrapper">
              <p className="tool-subtitle-help">
                Ideal para ajustar cantidades de recetas de cocina, calcular combustible o equivalencias directas.
              </p>

              <div className="regla3-box">
                <div className="regla3-row">
                  <span className="regla3-text">Si</span>
                  <input
                    type="number"
                    placeholder="Ej. 4"
                    className="regla3-input"
                    value={reglaA}
                    onChange={(e) => setReglaA(e.target.value)}
                  />
                  <span className="regla3-text">equivale o rinde</span>
                  <input
                    type="number"
                    placeholder="Ej. 500 (g)"
                    className="regla3-input"
                    value={reglaB}
                    onChange={(e) => setReglaB(e.target.value)}
                  />
                </div>

                <div className="regla3-row" style={{ marginTop: '0.8rem' }}>
                  <span className="regla3-text">Entonces</span>
                  <input
                    type="number"
                    placeholder="Ej. 7"
                    className="regla3-input"
                    value={reglaC}
                    onChange={(e) => setReglaC(e.target.value)}
                  />
                  <span className="regla3-text">equivaldrá a</span>
                  <div className="regla3-result-pill">
                    {reglaResultado !== null ? Math.round(reglaResultado * 100) / 100 : 'X'}
                  </div>
                </div>
              </div>

              {reglaResultado !== null && (
                <div className="tool-result-card result-card-blue" style={{ marginTop: '1rem' }}>
                  <div className="tool-result-row">
                    <span className="tool-result-label">Resultado:</span>
                    <span className="tool-result-value highlight-blue">
                      {Math.round(reglaResultado * 1000) / 1000}
                    </span>
                  </div>
                  <p className="tool-result-tip">
                    💡 <strong>Paso a paso:</strong> ({valC} × {valB}) ÷ {valA} = {Math.round(reglaResultado * 1000) / 1000}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}