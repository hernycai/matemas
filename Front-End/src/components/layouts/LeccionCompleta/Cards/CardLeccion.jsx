import IconoConfeti from "../iconos/IconoConfeti";
import SlideCard from "../SlideCard";
import useCountUp from "../../../../hooks/useCountUp";

const CardLeccion = ({
  xp,
  porcentaje,
  progresoGlobal,
  isActive,
  onClick,
  onNext,
}) => {
  const xpAnim = useCountUp(xp, { enabled: isActive, durationMs: 900 });
  const pctAnim = useCountUp(porcentaje, { enabled: isActive, durationMs: 900 });
  const progAnim = useCountUp(progresoGlobal ?? 0, {
    enabled: isActive && progresoGlobal != null,
    durationMs: 1100,
  });

  return (
    <SlideCard isActive={isActive} onClick={onClick} onNext={onNext}>
      <IconoConfeti />
      <h3 className="fw-bold mt-2">Completaste la lección</h3>
      <div className="d-flex justify-content-center gap-3 my-3 flex-wrap">
        <div
          className="rounded-3 p-3 text-center"
          style={{ backgroundColor: "#EAF6FF", minWidth: 120 }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <img src="/leccion/flecha.png" alt="" style={{ width: 36, height: 36 }} />
            <span className="fw-bold fs-3 reward-count">+{xpAnim}</span>
          </div>
          <div className="text-muted small mt-2">Experiencia ganada</div>
        </div>

        <div
          className="rounded-3 p-3 text-center"
          style={{ backgroundColor: "#EAF6FF", minWidth: 120 }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <img src="/leccion/check.png" alt="" style={{ width: 36, height: 36 }} />
            <span className="fw-bold fs-3 reward-count">{pctAnim}%</span>
          </div>
          <div className="text-muted small mt-2">Aciertos del módulo</div>
        </div>
      </div>

      {progresoGlobal != null && (
        <div className="rounded-3 p-3 text-start" style={{ backgroundColor: "#FFF8D6" }}>
          <div className="d-flex justify-content-between small fw-semibold mb-1">
            <span>Progreso global</span>
            <span className="reward-count">{progAnim}%</span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "#eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progAnim}%`,
                height: "100%",
                background: "linear-gradient(90deg, #FFDB54, #F5C518)",
                transition: "width 0.2s linear",
              }}
            />
          </div>
        </div>
      )}
    </SlideCard>
  );
};

export default CardLeccion;
