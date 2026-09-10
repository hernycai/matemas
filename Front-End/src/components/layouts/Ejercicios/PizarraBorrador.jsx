import { useRef, useState, useEffect } from 'react';
import './PizarraBorrador.css';
import { FaPen, FaEraser, FaUndo, FaTrash, FaTimes } from 'react-icons/fa';

export default function PizarraBorrador({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [color, setColor] = useState('#1e3a8a'); // Azul lapicera
  const [lineWidth, setLineWidth] = useState(3);
  const historyRef = useRef([]);

  // Ajustar tamaño del canvas al contenedor real
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Guardar snapshot inicial en blanco
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  }, [isOpen]);

  if (!isOpen) return null;

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 25) {
      historyRef.current.shift();
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#fffdfa';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    saveState();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    historyRef.current.pop();
    const previousState = historyRef.current[historyRef.current.length - 1];
    const ctx = canvas.getContext('2d');
    ctx.putImageData(previousState, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  return (
    <div className="pizarra-overlay" onClick={onClose}>
      <div className="pizarra-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="pizarra-header">
          <div className="pizarra-title-group">
            <h3 className="pizarra-title">Borrador Matemático</h3>
            <span className="pizarra-badge">Hoja de cálculos</span>
          </div>
          <button
            type="button"
            className="pizarra-close-btn"
            onClick={onClose}
            aria-label="Cerrar pizarra"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Barra de herramientas */}
        <div className="pizarra-toolbar">
          <div className="pizarra-tool-group">
            <button
              type="button"
              className={`pizarra-btn-tool ${tool === 'pen' ? 'active' : ''}`}
              onClick={() => setTool('pen')}
            >
              <FaPen size={14} /> Lápiz
            </button>
            <button
              type="button"
              className={`pizarra-btn-tool ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setTool('eraser')}
            >
              <FaEraser size={14} /> Goma
            </button>
          </div>

          {/* Selector de colores */}
          {tool === 'pen' && (
            <div className="pizarra-tool-group">
              {[
                { hex: '#1e3a8a', label: 'Azul lapicera' },
                { hex: '#111827', label: 'Negro grafito' },
                { hex: '#dc2626', label: 'Rojo corrección' },
                { hex: '#059669', label: 'Verde pizarra' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`color-dot ${color === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          )}

          {/* Grosor y acciones */}
          <div className="pizarra-tool-group">
            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="pizarra-btn-tool"
              style={{ cursor: 'pointer' }}
              aria-label="Grosor de trazo"
            >
              <option value={2}>Fino</option>
              <option value={4}>Medio</option>
              <option value={7}>Grueso</option>
            </select>
            <button
              type="button"
              className="pizarra-btn-tool"
              onClick={handleUndo}
              title="Deshacer último trazo"
            >
              <FaUndo size={13} /> Deshacer
            </button>
            <button
              type="button"
              className="pizarra-btn-tool"
              onClick={handleClear}
              title="Borrar toda la hoja"
              style={{ color: '#dc2626' }}
            >
              <FaTrash size={13} /> Limpiar
            </button>
          </div>
        </div>

        {/* Área de dibujo sobre hoja cuadriculada */}
        <div className="pizarra-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="pizarra-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Pie de ayuda */}
        <div className="pizarra-footer">
          <span>Hacé tus cuentas, tachá o dividí a mano como en un cuaderno.</span>
          <span>Tus apuntes se mantienen mientras dure la sesión.</span>
        </div>
      </div>
    </div>
  );
}
