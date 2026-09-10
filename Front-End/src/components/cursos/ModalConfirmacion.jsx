import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaLightbulb, FaRocket } from "react-icons/fa";
import { getSectionOverview } from "../../data/exercisesOverview";
import "./ModalConfirmacion.css";

export default function ModalConfirmacion({
  show,
  handleClose,
  handleToEjercicios,
  handleToDesafios,
  seccion,
}) {
  const info = getSectionOverview(seccion);

  const onStart = () => {
    if (handleToEjercicios) {
      handleToEjercicios();
    } else if (handleToDesafios) {
      handleToDesafios();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-ejercicio-explicacion"
      centered
    >
      <div className="modal-ejercicio-header">
        <img
          src="/mascot.png"
          alt="Mascota Mate+"
          className="modal-ejercicio-mascot"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="modal-ejercicio-header-info">
          <div className="modal-ejercicio-badge-row">
            <span className="modal-ejercicio-badge-nivel">
              {info.nivelTexto || `Nivel ${info.nivel || 1}`}
            </span>
            {info.puntos && (
              <span className="modal-ejercicio-badge-puntos">
                +{info.puntos} pts de recompensa
              </span>
            )}
          </div>
          <h2 className="modal-ejercicio-title">{info.titulo}</h2>
          {info.subtitulo && (
            <p className="modal-ejercicio-subtitle">{info.subtitulo}</p>
          )}
        </div>
      </div>

      <div className="modal-ejercicio-body">
        {/* Descripción general del ejercicio */}
        <div className="modal-ejercicio-desc-box">
          <p className="modal-ejercicio-desc-text">{info.descripcion}</p>
        </div>

        {/* Qué vas a practicar */}
        <div className="modal-ejercicio-section-label">
          <span>🎯 ¿De qué se trata este ejercicio?</span>
        </div>

        <div className="modal-ejercicio-que-practicaras">
          {info.quePracticaras?.map((punto, index) => (
            <div key={index} className="modal-ejercicio-item-row">
              <FaCheckCircle className="modal-ejercicio-item-icon" size={16} />
              <span>{punto}</span>
            </div>
          ))}
        </div>

        {/* Consejo o estrategia clave */}
        {info.consejo && (
          <div className="modal-ejercicio-consejo-box">
            <strong>
              <FaLightbulb style={{ marginRight: 6 }} />
              Consejo práctico:
            </strong>{" "}
            {info.consejo}
          </div>
        )}
      </div>

      <div className="modal-ejercicio-footer">
        <Button
          type="button"
          className="modal-ejercicio-btn-volver"
          onClick={handleClose}
        >
          Volver
        </Button>
        <Button
          type="button"
          className="modal-ejercicio-btn-comenzar"
          onClick={onStart}
        >
          <FaRocket /> Comenzar Ejercicio
        </Button>
      </div>
    </Modal>
  );
}
