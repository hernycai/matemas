/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api";
import { useNavigate } from "react-router-dom";
import "./onboarding.css";
import HeaderMate from "../HeaderMate/HeaderMate";
import { useMascot } from "../../../mascotas/core/useMascot";
import { MascotWidget } from "../../../mascotas/components/MascotWidget";
import { DivisionMascot } from "../../../mascotas/mascotas/division/DivisionMascot";
import { MultiMascot } from "../../../mascotas/mascotas/multi/MultiMascot";
import { SumaMascot } from "../../../mascotas/mascotas/suma/SumaMascot";
import { RestaMascot } from "../../../mascotas/mascotas/resta/RestaMascot";

const initialFormState = {
  nombre: "",
  apellidos: "",
  uid: "",
  desafio: "",
  edad: "",
  genero: "",
  sentimiento: "",
  email: "",
  mascota: "", // Campo para guardar la mascota seleccionada
};

// Componente interno que usa el contexto de mascota
function MascotaSelection() {
  const { setMascot, react } = useMascot();
  const [selectedMascota, setSelectedMascota] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Modifica la función handleSelectMascota en el componente MascotaSelection
  const handleSelectMascota = (mascotaId) => {
    setSelectedMascota(mascotaId);
    setMascot(mascotaId);

    // Reacción de celebración al seleccionar
    setShowCelebration(true);
    react("celebration", `¡${mascotaId} te acompañará!`);

    setTimeout(() => {
      setShowCelebration(false);
    }, 1500);

    // Actualizar el formData del padre
    window.dispatchEvent(
      new CustomEvent("mascotaSelected", {
        detail: { mascota: mascotaId },
        // Añadir esta propiedad para indicar que NO es un submit
        bubbles: false,
        cancelable: false,
      }),
    );
  };

  return (
    <div className="mascota-selection-container">
      <div className="mascota-widget-wrapper">
        <MascotWidget size={160} />
        {showCelebration && (
          <div className="mascota-celebration-badge">
            ✨ ¡Mascota seleccionada! ✨
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "10px",
          margin: "0 20px",
        }}
      >
        <button
          type="button"
          className={`mascota-btn ${selectedMascota === "division" ? "selected" : ""}`}
          onClick={() => handleSelectMascota("division")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <DivisionMascot size={100} className="mx-auto" />
        </button>
        <button
          type="button"
          className={`mascota-btn ${selectedMascota === "multi" ? "selected" : ""}`}
          onClick={() => handleSelectMascota("multi")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <MultiMascot size={100} className="mx-auto" />
        </button>
        <button
          type="button"
          className={`mascota-btn ${selectedMascota === "suma" ? "selected" : ""}`}
          onClick={() => handleSelectMascota("suma")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <SumaMascot size={100} className="mx-auto" />
        </button>
        <button
          type="button"
          className={`mascota-btn ${selectedMascota === "resta" ? "selected" : ""}`}
          onClick={() => handleSelectMascota("resta")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <RestaMascot size={100} className="mx-auto" />
        </button>
      </div>
    </div>
  );
}

// Componente principal del onboarding
function SecondSection() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(false);

  const stepLabels = ["Paso 1", "Paso 2", "Paso 3", "Paso 4"];

  // Escuchar evento de selección de mascota
  useEffect(() => {
    const handleMascotaSelected = (event) => {
      event.preventDefault();

      const { mascota } = event.detail;
      setFormData((prev) => ({ ...prev, mascota }));
      setMascotaSeleccionada(true);
    };

    window.addEventListener("mascotaSelected", handleMascotaSelected);
    return () => {
      window.removeEventListener("mascotaSelected", handleMascotaSelected);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        uid: user.id,
        email: user.email,
      }));
    }
  }, [user]);

  const handleSelectOption = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Validación especial para el paso de mascota (ahora paso 4, index 3)
    if (currentStep === 3 && !mascotaSeleccionada) {
      return;
    }

    if (currentStep < stepLabels.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    const fechaActual = new Date().toISOString();

    const dataToSubmit = {
      ...formData,
      fechaRespuesta: fechaActual,
      nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
    };

    try {
      await api.post("/usuarios/registro", dataToSubmit);
      await refreshProfile();
      setStatus({
        loading: false,
        error: "",
        success: "Formulario enviado correctamente.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setStatus({ loading: false, error: errorMsg, success: "" });
      // No navegamos si falló — así el usuario ve el error y no queda en loop
    }
  };

  const opcionesDesafios = [
    "Porcentajes",
    "Finanzas cotidianas",
    "Fracciones y proporciones",
    "Geometría básica",
    "Estimulación cognitiva",
  ];

  const opcionesTiempo = [
    "5 minutos",
    "10 minutos",
    "15 minutos",
    "+15 minutos",
  ];

  const opcionesEdades = ["20 a 30 años", "30 a 50 años", "+ 50 años"];

  return (
    <div className="onboarding-container">
      <HeaderMate />
      <div className="progress-bar">
        {stepLabels.map((label, index) => (
          <div
            className={`step ${index < currentStep ? "completed" : ""} ${index === currentStep ? "current" : ""}`}
            key={label}
          >
            <p className={index <= currentStep ? "active" : ""}>{label}</p>
            <div className={`bullet ${index <= currentStep ? "active" : ""}`}>
              <span>{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="form-outer">
        <form
          onSubmit={handleSubmit}
          style={{ marginLeft: `-${currentStep * 100}%` }}
        >
          {/* PASO 1: DESAFÍOS */}
          <div className="page">
            <div className="title">
              ¿Qué desafío de tu vida diaria te gustaría dominar primero?
            </div>
            <div className="options-grid">
              {opcionesDesafios.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`option-btn ${formData.desafio === opcion ? "selected" : ""}`}
                  onClick={() => handleSelectOption("desafio", opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>

            <div className="field btns central-btn" style={{}}>
              <button
                type="button"
                className="next"
                onClick={nextStep}
                disabled={!formData.desafio}
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* PASO 2: TIEMPO */}
          <div className="page">
            <div className="title">
              ¿Cuánto tiempo podés dedicarle a tu agilidad mental por día?
            </div>
            <div className="options-grid">
              {opcionesTiempo.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`option-btn ${formData.tiempo === opcion ? "selected" : ""}`}
                  onClick={() => handleSelectOption("tiempo", opcion)}
                >
                  {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                </button>
              ))}
            </div>
            <div className="field btns">
              <button type="button" className="prev" onClick={prevStep}>
                Atrás
              </button>
              <button
                type="button"
                className="next"
                onClick={nextStep}
                disabled={!formData.tiempo}
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* PASO 3: EDAD */}
          <div className="page">
            <div className="title">¿En qué rango de edad te encontrás?</div>
            <div className="options-grid full-width-options">
              {opcionesEdades.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`option-btn ${formData.edad === opcion ? "selected" : ""}`}
                  onClick={() => handleSelectOption("edad", opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>

            <div className="field btns">
              <button type="button" className="prev" onClick={prevStep}>
                Atrás
              </button>
              <button
                type="button"
                className="next"
                onClick={nextStep}
                disabled={!formData.edad}
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* PASO 4: MASCOTA (Último paso) */}
          <div className="page">
            <div className="title">¡Elegí tu compañero de aprendizaje!</div>
            <div className="subtitle">
              Cada mascota tiene una personalidad única que te acompañará en tu
              viaje
            </div>

            <div className="mascota-container">
              <MascotaSelection />
              {!mascotaSeleccionada && (
                <div className="mascota-hint">
                  💡 Hacé clic en una mascota para seleccionarla
                </div>
              )}
            </div>

            <div className="field btns">
              <button type="button" className="prev" onClick={prevStep}>
                Atrás
              </button>
              <button
                type="submit"
                className="submit"
                disabled={status.loading || !mascotaSeleccionada}
              >
                {status.loading ? "Enviando..." : "¡Comenzar!"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {status.error && <p className="status-msg error">{status.error}</p>}
      {status.success && <p className="status-msg success">{status.success}</p>}
    </div>
  );
}

export default SecondSection;
