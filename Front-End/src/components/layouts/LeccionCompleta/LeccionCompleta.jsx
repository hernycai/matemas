import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderMate from "../HeaderMate/HeaderMate";
import CardRacha from "./Cards/CardRacha";
import CardLeccion from "./Cards/CardLeccion";
import CardMoneda from "./Cards/CardMoneda";
import { useMascotContext } from "../../../mascotas/core/MascotProvider";
import "./LeccionCompleta.css";

const TOTAL_SLIDES = 3;

const DesafioCompletado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setState } = useMascotContext();
  const [index, setIndex] = useState(0);

  const rewards = location.state?.rewards || {};
  const racha = rewards.racha ?? 0;
  const xp = rewards.xpGanado ?? rewards.xp ?? 0;
  const xpTotal = rewards.xpTotal ?? xp;
  const porcentaje = rewards.porcentajeCorrectas ?? rewards.porcentaje ?? 100;
  const monedas = rewards.monedasGanadas ?? rewards.monedas ?? 0;
  const seccionNombre = rewards.seccionNombre || "el módulo";
  const progresoGlobal = rewards.progresoGlobal ?? null;

  useEffect(() => {
    try {
      setState?.("celebration");
    } catch {
      /* mascota sin estado celebration */
    }
    return () => {
      try {
        setState?.("idle");
      } catch {
        /* ignore */
      }
    };
  }, [setState]);

  const finish = () => {
    navigate("/dashboard", {
      replace: true,
      state: {
        openRewards: true,
        rewardPulse: {
          monedas,
          xp,
          racha,
          progresoGlobal,
        },
      },
    });
  };

  const siguienteSeccionId = rewards.siguienteSeccionId ?? (rewards.seccionId ? Number(rewards.seccionId) + 1 : null);

  const irASiguienteNivel = () => {
    if (siguienteSeccionId && siguienteSeccionId <= 6) {
      navigate(`/ejercicios/${siguienteSeccionId}`, { replace: true });
    } else {
      finish();
    }
  };

  const handleNext = () => {
    if (index < TOTAL_SLIDES - 1) {
      setIndex((prev) => prev + 1);
    } else {
      if (siguienteSeccionId && siguienteSeccionId <= 6) {
        irASiguienteNivel();
      } else {
        finish();
      }
    }
  };

  return (
    <>
      <HeaderMate />
      <div className="leccion-completa-page">
        <div className="leccion-completa-confetti" aria-hidden="true" />
        <p className="leccion-completa-eyebrow">¡Módulo completado!</p>
        <h1 className="leccion-completa-title">{seccionNombre}</h1>
        <p className="leccion-completa-subtitle">
          Recolectá tus recompensas y continuá avanzando
        </p>

        <div className="leccion-completa-carousel-wrap">
          <div
            className="leccion-completa-carousel"
            style={{
              transform: `translateX(calc(50vw - 160px - ${index * 336}px))`,
            }}
          >
            <CardRacha
              racha={racha}
              isActive={index === 0}
              onClick={() => setIndex(0)}
              onNext={handleNext}
            />
            <CardLeccion
              xp={xp}
              xpTotal={xpTotal}
              porcentaje={porcentaje}
              progresoGlobal={progresoGlobal}
              isActive={index === 1}
              onClick={() => setIndex(1)}
              onNext={handleNext}
            />
            <CardMoneda
              monedas={monedas}
              isActive={index === 2}
              onClick={() => setIndex(2)}
              onNext={handleNext}
              nextLabel={siguienteSeccionId && siguienteSeccionId <= 6 ? `Ir al Nivel ${siguienteSeccionId} 🚀` : "Ir al dashboard"}
            />
          </div>
        </div>

        <div className="leccion-completa-dots" role="tablist" aria-label="Recompensas">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`leccion-completa-dot ${i === index ? "is-active" : ""}`}
              aria-label={`Recompensa ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        {/* Botones de acción rápida para avanzar */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {siguienteSeccionId && siguienteSeccionId <= 6 ? (
            <button
              type="button"
              onClick={irASiguienteNivel}
              style={{
                backgroundColor: "#0A3D91",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "14px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(10, 61, 145, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>
                🚀 Continuar al Nivel {siguienteSeccionId}
                {siguienteSeccionId === 2 && " (Descuentos y Rebajas)"}
                {siguienteSeccionId === 3 && " (Cuentas y Propinas)"}
                {siguienteSeccionId === 4 && " (Cuotas e Intereses)"}
                {siguienteSeccionId === 5 && " (Cocina y Medidas)"}
                {siguienteSeccionId === 6 && " (Gran Desafío Maestro)"}
              </span>
            </button>
          ) : (
            <div style={{ width: "100%", textAlign: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#166534" }}>
                🏆 ¡Completaste todos los Desafíos de Porcentajes!
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={finish}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#334155",
              border: "1px solid #CBD5E1",
              borderRadius: "14px",
              padding: "12px 20px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default DesafioCompletado;
