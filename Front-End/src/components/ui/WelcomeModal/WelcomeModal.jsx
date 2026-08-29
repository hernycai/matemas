import { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaShoppingCart, FaCreditCard, FaBrain } from 'react-icons/fa';
import './WelcomeModal.css';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mostrar si no se ha cerrado en esta sesión
    const isDismissed = sessionStorage.getItem('mate_welcome_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('mate_welcome_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" onClick={handleClose}>
      <div 
        className="welcome-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <button 
          className="welcome-close-btn" 
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        <div className="welcome-hero-badge">
          🧠
        </div>

        <div className="welcome-pill">
          ✨ Bienvenido a MATE+
        </div>

        <h2 id="welcome-title" className="welcome-title">
          Tu gimnasio mental para la vida cotidiana
        </h2>

        <p className="welcome-description">
          Una plataforma interactiva diseñada especialmente para <strong>adultos</strong>. Entrená tu cálculo mental rápido y ganá total autonomía en tus decisiones del día a día.
        </p>

        <div className="welcome-features-list">
          <div className="welcome-feature-item">
            <span className="welcome-feature-icon">🛒</span>
            <div>
              <strong>Compras y Ofertas:</strong> Aprendé a calcular descuentos (20%, 35%, 50%), promociones 2x1 y vueltos exactos sin calculadora.
            </div>
          </div>

          <div className="welcome-feature-item">
            <span className="welcome-feature-icon">💳</span>
            <div>
              <strong>Finanzas y Cuentas:</strong> Dividí cenas con amigos, deliverys y evaluá si te conviene pagar en cuotas o al contado.
            </div>
          </div>

          <div className="welcome-feature-item">
            <span className="welcome-feature-icon">🐾</span>
            <div>
              <strong>Tutores IA Personalizados:</strong> Aprendé a tu propio ritmo con la ayuda de tutores virtuales que te guían paso a paso.
            </div>
          </div>
        </div>

        <button 
          type="button" 
          className="welcome-submit-btn" 
          onClick={handleClose}
        >
          <FaCheck /> ¡Entendido, empezar! (OK)
        </button>
      </div>
    </div>
  );
}
