/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalAyuda from '../../Consejos/ModalAyuda.jsx';
import ModalCalculadora from '../../Calculadora/Calculadora.jsx';
import { useMascotContext } from "../../../../mascotas/core/MascotProvider";
import { FaComments } from "react-icons/fa";
import "./headerDesafio.css";

export default function HeaderDesafio({ progreso = 100, seccionId = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCalculator, setIsOpenCalculator] = useState(false);
  const { openChat } = useMascotContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsOpen(params.get('help') === 'true' || params.get('ayuda') === '1');
  }, [location.search]);

  const openHelpModal = () => {
    const params = new URLSearchParams(location.search);
    params.set('help', 'true');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    setIsOpen(true);
  };

  const closeHelpModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete('help');
    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, { replace: true });
    setIsOpen(false);
  };

  const openLevelVideo = () => {
    if (!seccionId) return;
    const returnTo = encodeURIComponent(location.pathname + location.search);
    navigate(`/desafios/${seccionId}?next=${returnTo}`);
  };

  return (
    <>
      <ModalAyuda isOpen={isOpen} onClose={closeHelpModal} />
      <ModalCalculadora isOpen={isOpenCalculator} onClose={() => setIsOpenCalculator(false)} />

      <div className="header-desafio">
        <div className="header-desafio-progress">
          <Link to="/dashboard" className="header-desafio-back">
            <img src="/login/iconButton.png" alt="volver" className="back-icon" />
          </Link>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>

        <div className="header-desafio-icons">
          <button
            className="icon-btn"
            type="button"
            onClick={openLevelVideo}
            disabled={!seccionId}
            title={seccionId ? "Ver video de este nivel" : "Video no disponible"}
            aria-label="Ver video de este nivel"
          >
            <img src="/icons/Book.png" alt="" />
          </button>

          <button className="icon-btn" type="button" onClick={() => setIsOpenCalculator(true)} title="Abrir calculadora cotidiana">
            <img src="/icons/Calculator.png" alt="calculadora" />
          </button>

          <button className="icon-btn" type="button" onClick={openHelpModal} title="Abrir pista">
            <img src="/icons/Light.png" alt="foco" />
          </button>

          <button
            className="icon-btn"
            type="button"
            onClick={() => openChat()}
            title="Consultar al Tutor Matemático"
            aria-label="Consultar al Tutor Matemático"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A3D91' }}
          >
            <FaComments size={22} />
          </button>
        </div>
      </div>
    </>
  );
}

