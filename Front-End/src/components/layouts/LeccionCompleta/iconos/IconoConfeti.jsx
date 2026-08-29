import { useRef } from "react";
import "../iconos/icons.css";

const IconoConfeti = () => {
  const ref = useRef(null);

  const pop = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-pop");
    void el.offsetWidth;
    el.classList.add("is-pop");
    setTimeout(() => el.classList.remove("is-pop"), 800);
  };

  return (
    <button
      ref={ref}
      className="app-icon app-icon--confetti"
      onClick={pop}
      type="button"
      aria-label="Completaste la lección"
    >
      <span className="confetti-burst">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`piece piece-${i + 1}`} />
        ))}
      </span>

      <svg
        className="icon-svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- DESTELLOS Y ESTRELLAS --- */}
        {/* Estrella Cyan Superior Izquierda */}
        <path
          d="M 35 12 Q 35 20 27 20 Q 35 20 35 28 Q 35 20 43 20 Q 35 20 35 12 Z"
          fill="#00E5FF"
        />

        {/* Estrella Amarilla Izquierda */}
        <path
          d="M 21 40 Q 21 46 15 46 Q 21 46 21 52 Q 21 46 27 46 Q 21 46 21 40 Z"
          fill="#FFD600"
        />

        {/* Estrella Cyan Inferior Derecha */}
        <path
          d="M 80 60 Q 80 68 72 68 Q 80 68 80 76 Q 80 68 88 68 Q 80 68 80 60 Z"
          fill="#00E5FF"
        />

        {/* --- CÍRCULOS DE CONFETI --- */}
        {/* Punto Rojo Superior */}
        <circle cx="62" cy="14" r="4.5" fill="#FF3B60" />
        {/* Punto Amarillo Derecho */}
        <circle cx="85" cy="37" r="4.5" fill="#FFD600" />

        {/* --- SERPENTINAS CURVAS --- */}
        {/* Serpentina Roja Izquierda */}
        <path
          d="M 47 43 C 53 28 41 22 49 14"
          fill="none"
          stroke="#FF3B60"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Serpentina Cyan Central */}
        <path
          d="M 57 47 C 71 35 56 22 75 20"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Serpentina Roja Derecha */}
        <path
          d="M 63 55 C 71 47 81 50 88 53"
          fill="none"
          stroke="#FF3B60"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* --- CONO LANZADOR (PARTY POPPER) --- */}
        <g transform="translate(42, 65) rotate(40)">
          {/* Sombra de la base del cono */}
          <path d="M -18 -10 L 22 -10 L 3 42 A 4 4 0 0 1 -3 42 Z" fill="#FFA000" />

          {/* Cuerpo Amarillo Principal */}
          <path d="M -18 -10 L 18 -10 L 2 40 A 4 4 0 0 1 -2 40 Z" fill="#FFC107" />

          {/* Brillo Blanco alargado */}
          <rect x="-14" y="-3" width="5" height="24" rx="2.5" fill="#FFFFFF" opacity="0.85" />

          {/* Borde Superior Naranja (Boca del cono) */}
          <rect x="-22" y="-18" width="44" height="12" rx="6" fill="#FF9800" />
        </g>
      </svg>
    </button>
  );
};

export default IconoConfeti;