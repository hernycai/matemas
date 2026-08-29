import IconoRacha from "../iconos/IconoRacha";
import SlideCard from "../SlideCard";
import useCountUp from "../../../../hooks/useCountUp";

const diasSemana = ["Lu", "Ma", "Mi", "Ju", "Vi"];

const CardRacha = ({ racha, isActive, onClick, onNext }) => {
  const animated = useCountUp(racha, { enabled: isActive, durationMs: 800 });

  return (
    <SlideCard isActive={isActive} onClick={onClick} onNext={onNext}>
      <IconoRacha />
      <h2 className="fw-bold reward-count" style={{ fontSize: 48 }}>
        {animated}
      </h2>
      <p className="fw-semibold mb-3">Días de racha</p>
      <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: "#EAF6FF" }}>
        <div className="d-flex justify-content-center gap-2 mb-2">
          {diasSemana.map((dia, i) => (
            <div key={dia} className="text-center">
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                {dia}
              </div>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: i < animated ? "#2ECC71" : "#D0E8F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 14,
                }}
              >
                {i < animated ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted small mb-0">
          No te olvides de practicar cada día para no perder la racha
        </p>
      </div>
    </SlideCard>
  );
};

export default CardRacha;
