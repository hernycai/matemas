import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { IoPlayCircleOutline, IoLockClosed, IoCheckmarkCircle } from "react-icons/io5";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function SectionItem({
  leccion,
  currentIndex,
  isTransitioning,
  setCurrentIndex,
  index,
  handleShow,
  locked = false,
  aprobado = false,
}) {
  const isActive = index === currentIndex;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const distance = index - currentIndex;

  let opacity = 0;
  let yOffset = 0;
  let zIndex = 0;
  let scale = 1;

  if (distance === 0) {
    opacity = locked ? 0.75 : 1;
    yOffset = 0;
    zIndex = 10;
    scale = 1;
  } else if (distance === 1) {
    opacity = 0.5;
    yOffset = -150;
    zIndex = 5;
    scale = 0.9;
  } else if (distance === 2) {
    opacity = 0.15;
    yOffset = -250;
    zIndex = 3;
    scale = 0.8;
  }

  const nivelNumero = leccion.grado || index + 1;
  const accent = locked ? "#94A3B8" : isActive ? "#52C5FE" : "white";

  return (
    <motion.div
      key={leccion.id}
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "absolute",
        width: isMobile ? "90%" : "80%",
        height: isMobile ? "40%" : "50%",
        margin: "0 auto",
        borderTopLeftRadius: "80px",
        borderTopRightRadius: "80px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: isActive ? "0px -3px 4.4px 0px #FFFFFF4F" : "none",
        cursor: "pointer",
        backgroundColor: locked ? "#E2E8F0" : "#FFE16F",
        zIndex: zIndex,
        filter: locked ? "grayscale(0.35)" : "none",
      }}
      initial={false}
      animate={{
        opacity: opacity,
        y: yOffset,
        scale: scale,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => {
        if (!isTransitioning.current) {
          setCurrentIndex(index);
        }
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: isActive && !locked ? 0.1 : 0,
          backgroundImage: isActive ? "url(/bg-selected.jpg)" : "none",
          borderTopLeftRadius: "80px",
          borderTopRightRadius: "80px",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          borderTopLeftRadius: "80px",
          borderTopRightRadius: "80px",
          padding: "10%",
          gap: "2rem",
        }}
      >
        <h3
          style={{
            color: accent,
            fontWeight: "bold",
            fontSize: "10rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {nivelNumero}
        </h3>

        <div
          className="d-flex flex-column align-items-start justify-content-center"
          style={{ gap: "1rem", flex: 1 }}
        >
          <Button
            style={{
              height: "auto",
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: locked ? 0.7 : 1,
            }}
            disabled={locked}
            title={locked ? "Completá el nivel anterior para desbloquear" : "Ver video / empezar"}
            onClick={(e) => {
              e.stopPropagation();
              if (!locked) handleShow();
            }}
          >
            {locked ? (
              <IoLockClosed
                style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  color: accent,
                }}
              />
            ) : aprobado ? (
              <IoCheckmarkCircle
                style={{
                  width: "5rem",
                  height: "5rem",
                  color: "#22C55E",
                }}
              />
            ) : (
              <IoPlayCircleOutline
                style={{
                  width: "5rem",
                  height: "5rem",
                  color: accent,
                }}
              />
            )}
          </Button>

          <p
            style={{
              color: locked ? "#64748B" : "#52C5FE",
              fontWeight: 700,
              fontSize: "1.25rem",
              margin: 0,
            }}
          >
            {leccion.titulo}
            {locked ? " (bloqueado)" : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
