import IconoMoneda from "../iconos/IconoMoneda";
import SlideCard from "../SlideCard";
import useCountUp from "../../../../hooks/useCountUp";

const CardMoneda = ({
  monedas,
  isActive,
  onClick,
  onNext,
  nextLabel = "Siguiente",
}) => {
  const animated = useCountUp(monedas, { enabled: isActive, durationMs: 1000 });

  return (
    <SlideCard
      isActive={isActive}
      onClick={onClick}
      onNext={onNext}
      nextLabel={nextLabel}
    >
      <IconoMoneda />
      <h3 className="fw-bold mt-2">
        Ganaste <span className="reward-count">{animated}</span> monedas
      </h3>
      <p className="text-muted small mt-2">
        Se suman a tu inventario. Abrí el panel de progreso en el dashboard para
        verlas juntarse con el resto de tus íconos.
      </p>
    </SlideCard>
  );
};

export default CardMoneda;
