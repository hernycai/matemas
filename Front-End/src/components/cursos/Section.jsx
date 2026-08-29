/* eslint-disable react-hooks/set-state-in-effect */
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import SectionItem from "./SectionItem";
import ModalConfirmacion from "./ModalConfirmacion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function CursoSection() {
  const { profile, refreshProfile } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setScrollDirection] = useState(0);
  const isTransitioning = useRef(false);
  const [lecciones, setLecciones] = useState([]);
  const desafioKey = String(profile?.desafioActualId ?? profile?.desafio ?? "all");
  const [desafioCargadoKey, setDesafioCargadoKey] = useState(null);
  const loadingLecciones = desafioCargadoKey !== desafioKey;

  // Si el onboarding guardó el texto pero no el id de rama, linkear ahora.
  useEffect(() => {
    let activo = true;
    const linkDesafio = async () => {
      if (profile?.desafioActualId || !profile?.desafio) return;
      try {
        const { data: ramas } = await api.get("/ramas");
        const key = String(profile.desafio)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const rama = (ramas || []).find((r) => {
          const rn = String(r.nombre)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return key.includes(rn) || rn.includes(key.split(" ")[0]);
        });
        if (!rama || !activo) return;
        await api.patch("/usuarios/desafio-actual", { desafioActualId: rama.id });
        await refreshProfile?.();
      } catch (err) {
        console.warn("No se pudo sincronizar desafío con rama:", err);
      }
    };
    linkDesafio();
    return () => {
      activo = false;
    };
  }, [profile?.desafio, profile?.desafioActualId, refreshProfile]);

  useEffect(() => {
    let activo = true;

    api
      .get("/secciones")
      .then((res) => {
        if (!activo) return;
        let secciones = res.data || [];
        if (profile?.desafioActualId) {
          secciones = secciones.filter(
            (s) => s.ramaId === profile.desafioActualId,
          );
        } else if (profile?.desafio) {
          const key = String(profile.desafio).toLowerCase();
          secciones = secciones.filter((s) => {
            const ramaNombre = s.rama?.nombre?.toLowerCase() || "";
            return (
              key.includes(ramaNombre) ||
              ramaNombre.includes(key.split(" ")[0]) ||
              s.nombre?.toLowerCase().includes(key.split(" ")[0])
            );
          });
        }
        secciones = [...secciones].sort(
          (a, b) => (a.grado ?? 0) - (b.grado ?? 0) || a.id - b.id,
        );
        const conTitulo = secciones.map((s) => ({ ...s, titulo: s.nombre }));
        // MANTENER ORDEN ASCENDENTE: nivel 1 primero, nivel 6 al final
        setLecciones(conTitulo);
        // Iniciar en el nivel 1 (primer elemento)
        setCurrentIndex(0);
        setDesafioCargadoKey(desafioKey);
      })
      .catch((err) => {
        if (!activo) return;
        console.error("Error al cargar secciones:", err);
        setLecciones([]);
        setDesafioCargadoKey(desafioKey);
      });

    return () => {
      activo = false;
    };
  }, [profile?.desafioActualId, profile?.desafio, desafioKey]);

  // Estados para touch events
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    const seccionActual = lecciones[currentIndex];
    if (seccionActual && seccionActual.estaDesbloqueada === false) return;
    setShow(true);
  };
  const handleToDesafios = () => {
    const seccionActual = lecciones[currentIndex];
    navigate(
      seccionActual
        ? `/desafios/${seccionActual.id}?next=/ejercicios/${seccionActual.id}`
        : "/desafios",
    );
    setShow(false);
  };
  const handleToEjercicios = () => {
    const seccionActual = lecciones[currentIndex];
    navigate(seccionActual ? `/ejercicios/${seccionActual.id}` : "/ejercicios");
    setShow(false);
  };

  // Función para cambiar de lección
  const changeLesson = useCallback(
    (direction) => {
      if (isTransitioning.current) return;

      const nextIdx = currentIndex + direction;

      if (nextIdx >= 0 && nextIdx < lecciones.length) {
        isTransitioning.current = true;
        setScrollDirection(direction);
        setCurrentIndex(nextIdx);

        setTimeout(() => {
          setScrollDirection(0);
          isTransitioning.current = false;
        }, 500);
      }
    },
    [currentIndex, lecciones.length],
  );

  // Manejo de scroll con rueda del mouse
  useEffect(() => {
    const handleWheel = (e) => {
      if (isMobile) return;
      // Scroll abajo = bajar (índice mayor), Scroll arriba = subir (índice menor)
      const direction = e.deltaY > 0 ? 1 : -1;
      changeLesson(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [changeLesson, isMobile]);

  // Manejo de teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (show) return;
      if (isMobile) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        changeLesson(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        changeLesson(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, lecciones.length, show, changeLesson, isMobile]);

  // Manejo de touch events para mobile
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning.current) return;
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning.current) {
      e.preventDefault();
      return;
    }
    setTouchEndY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isTransitioning.current) return;
    if (touchStartY === 0 || touchEndY === 0) return;

    const distance = touchStartY - touchEndY;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe hacia arriba = subir (índice menor)
        changeLesson(-1);
      } else {
        // Swipe hacia abajo = bajar (índice mayor)
        changeLesson(1);
      }
    }

    setTouchStartY(0);
    setTouchEndY(0);
  }, [touchStartY, touchEndY, changeLesson]);

  // Función para navegar con botones
  const handleNext = useCallback(() => {
    changeLesson(1); // Bajar (siguiente nivel)
  }, [changeLesson]);

  const handlePrev = useCallback(() => {
    changeLesson(-1); // Subir (nivel anterior)
  }, [changeLesson]);

  return (
    <>
      <ModalConfirmacion
        show={show}
        handleClose={handleClose}
        handleToDesafios={handleToDesafios}
        handleToEjercicios={handleToEjercicios}
      />

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: isMobile ? "100%" : "calc(100%)",
          position: "relative",
          borderRadius: "20px",
          backgroundColor: "white",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          touchAction: isMobile ? "none" : "auto",
        }}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <div
          style={{
            position: "absolute",
            width: "1440.21px",
            height: "275.41px",
            left: 0,
            right: 0,
            top: "0px",
            background:
              "linear-gradient(359.49deg, #FFFEFD 21.36%, rgba(255, 255, 254, 0.348019) 63.57%, rgba(255, 255, 255, 0) 81.39%)",
            transform: "rotate(-180deg)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50%",
            right: "0%",
            left: "0%",
            width: "100%",
            height: "100%",
            backgroundColor: "#28a745",
            borderRadius: "50%",
          }}
        />

        <TitleSection
          title={
            profile?.desafioActual?.nombre ||
            lecciones[0]?.rama?.nombre ||
            profile?.desafio ||
            "Elegí un desafío"
          }
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <AnimatePresence>
            {loadingLecciones && (
              <motion.div
                key="loader-secciones"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.85)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Oval
                    height={56}
                    width={56}
                    color="#16a34a"
                    secondaryColor="#bbf7d0"
                    strokeWidth={5}
                    strokeWidthSecondary={5}
                    ariaLabel="cargando-secciones"
                  />
                  <span style={{ color: "#14532d", fontWeight: 600 }}>
                    Cargando secciones...
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {lecciones.map((leccion, index) => (
            <SectionItem
              currentIndex={currentIndex}
              key={leccion.id}
              leccion={leccion}
              isTransitioning={isTransitioning}
              setCurrentIndex={setCurrentIndex}
              index={index}
              handleShow={handleShow}
              locked={leccion.estaDesbloqueada === false}
              aprobado={Boolean(leccion.estaAprobada)}
            />
          ))}
        </div>

        {/* ===== BOTONES DE NAVEGACIÓN ===== */}
        <NavigationButtons
          currentIndex={currentIndex}
          totalItems={lecciones.length}
          onPrev={handlePrev}
          onNext={handleNext}
          isMobile={isMobile}
        />

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(5px); }
          }
        `}</style>
      </div>
    </>
  );
}

// ===== COMPONENTE DE BOTONES DE NAVEGACIÓN =====
const NavigationButtons = ({ currentIndex, totalItems, onPrev, onNext, isMobile }) => {
  if (totalItems <= 1) return null;

  // El nivel es el índice + 1 (porque el array está en orden ascendente)
  const nivelActual = currentIndex + 1;
  const nivelTotal = totalItems;

  return (
    <div
      style={{
        position: "absolute",
        right: isMobile ? "10px" : "20px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "8px" : "12px",
        opacity: 1,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {/* Botón para subir (nivel superior) */}
      <motion.button
        onClick={onNext}
        disabled={currentIndex === totalItems - 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: isMobile ? "44px" : "48px",
          height: isMobile ? "44px" : "48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: currentIndex === totalItems - 1
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.6)",
          color: "white",
          cursor: currentIndex === totalItems - 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "20px" : "24px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <FiChevronUp />
      </motion.button>

      {/* Indicador de posición - NIVEL REAL */}
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: isMobile ? "11px" : "13px",
          fontWeight: "bold",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: "2px 8px",
          borderRadius: "12px",
          backdropFilter: "blur(4px)",
        }}
      >
        Nivel {nivelActual}/{nivelTotal}
      </div>

      {/* Botón para bajar (nivel inferior) */}
      <motion.button
        onClick={onPrev}
        disabled={currentIndex === 0}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: isMobile ? "44px" : "48px",
          height: isMobile ? "44px" : "48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: currentIndex === 0
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.6)",
          color: "white",
          cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "20px" : "24px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <FiChevronDown />
      </motion.button>
    </div>
  );
};

const TitleSection = ({ title }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <motion.div
      style={{
        position: "absolute",
        top: isMobile ? "3rem" : "2rem",
        left: isMobile ? "1.5rem" : "4rem",
        zIndex: 101,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.h2
        className="text-black"
        style={{
          fontWeight: 900,
          fontSize: isMobile ? "1.8rem" : "4rem",
          margin: 0,
        }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
};