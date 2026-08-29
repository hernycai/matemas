import React from 'react';
import './ModalAyuda.css';
import imagenFondo from '../../../assets/fondo_consejo.png'; 

function ModalAyuda({ 
  isOpen, 
  onClose, 
  desafio = "Módulo 1", 
  nivel = "Nivel Inicial", 
  ejercicio = "Ejercicio 1", 
  consejo = "Aquí se mostrará la explicación o pista dinámica provista por el backend para resolver este desafío." 
}) {
  
  // Si no está activo el modal, no renderiza nada en el árbol del DOM
  if (!isOpen) return null;

  return (
    <div className="modal-ayuda-overlay" onClick={onClose}>
      {/* 
        Detiene la propagación del click y aplica la imagen de fondo directamente en línea, 
        manteniendo un color de respaldo blanco sólido detrás.
      */}
      <div 
        className="modal-ayuda-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundImage: `url(${imagenFondo})` }}
      >
        
        {/* Botón de cerrar de la esquina superior derecha */}
        <button className="modal-ayuda-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Encabezados y Metadatos Dinámicos del Ejercicio */}
        <div className="modal-ayuda-header">
          <span className="modal-tag-modulo">{desafio}</span>
          <div className="modal-subheaders-row">
            <span className="modal-tag-detalle">{nivel}</span>
            <span className="modal-tag-separador">•</span>
            <span className="modal-tag-detalle">{ejercicio}</span>
          </div>
        </div>

        {/* Cuerpo del Consejo Informativo */}
        <div className="modal-ayuda-body">
          <h3 className="modal-ayuda-titulo">¡Una pista para ayudarte!</h3>
          <p className="modal-ayuda-texto">{consejo}</p>
        </div>

      </div>
    </div>
  );
}

export default ModalAyuda;
















