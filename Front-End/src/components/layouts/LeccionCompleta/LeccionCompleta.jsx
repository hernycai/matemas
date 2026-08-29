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

  const handleNext = () => {
    if (index < TOTAL_SLIDES - 1) {
      setIndex((prev) => prev + 1);
    } else {
      finish();
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
          Recolectá tus recompensas y sumalas a tu progreso
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
              nextLabel="Ir al dashboard"
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
      </div>
    </>
  );
};

export default DesafioCompletado;
