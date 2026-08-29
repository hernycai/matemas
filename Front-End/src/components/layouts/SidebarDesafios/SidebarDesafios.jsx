import { useEffect, useState } from "react";
import { LuBookText, LuX, LuSparkles, LuUserCheck } from "react-icons/lu";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";
import "./SidebarDesafios.css";

const DEFAULT_RAMAS = [
  { id: 1, nombre: "🛒 Presupuesto y Compras del Hogar" },
  { id: 2, nombre: "🏷️ Descuentos, Ofertas y Porcentajes" },
  { id: 3, nombre: "🍽️ División de Cuentas y Propinas" },
  { id: 4, nombre: "💳 Cuotas vs Contado e Intereses" },
  { id: 5, nombre: "🍳 Medidas y Proporciones" },
  { id: 6, nombre: "🏆 Gran Desafío Maestro" },
];

const SidebarDesafios = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { profile, refreshProfile, updateProfile } = useAuth();
  const [ramas, setRamas] = useState(DEFAULT_RAMAS);
  const [cambiando, setCambiando] = useState(false);
  const [loadingRamas, setLoadingRamas] = useState(false);
  const [errorRamas, setErrorRamas] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    api
      .get("/ramas")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setRamas(res.data);
        } else {
          setRamas(DEFAULT_RAMAS);
        }
      })
      .catch((err) => {
        console.warn("Cargando ramas pedagógicas locales:", err.message);
        setRamas(DEFAULT_RAMAS);
      })
      .finally(() => {
        setLoadingRamas(false);
      });
  }, [isOpen]);

  const desafioActualId = profile?.desafioActualId || 2;
  const desafioActual = ramas.find((r) => r.id === desafioActualId) || ramas[1];
  const otrasRamas = ramas.filter((r) => r.id !== desafioActualId);

  const cambiarDesafio = async (ramaId) => {
    if (cambiando || ramaId === desafioActualId) return;
    try {
      setCambiando(true);
      if (updateProfile) {
        await updateProfile({ desafioActualId: ramaId, desafio: ramas.find(r => r.id === ramaId)?.nombre });
      }
      try {
        await api.patch("/usuarios/desafio-actual", { desafioActualId: ramaId });
      } catch {
        /* offline */
      }
      if (refreshProfile) {
        await refreshProfile();
      }
      onClose();
    } catch (err) {
      console.error("Error al cambiar desafío:", err);
    } finally {
      setCambiando(false);
    }
  };

  const irAConfigurarPerfil = () => {
    onClose();
    navigate("/onboarding");
  };

  return (
    <>
      {/* Backdrop oscuro con desenfoque */}
      <div
        className={`sidebar-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          zIndex: 1999,
        }}
      />

      {/* Menú Lateral Deslizante desde la Izquierda */}
      <aside
        className={`sidebar-drawer ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "350px",
          maxWidth: "85vw",
          backgroundColor: "#FFFFFF",
          boxShadow: isOpen ? "8px 0 35px rgba(0,0,0,0.22)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          padding: "1.75rem 1.5rem",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LuBookText size={22} color="#0A3D91" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Ramas de Estudio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            <LuX size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 1.25rem 0" }}>
          Elegí la rama de entrenamiento práctico para tus desafíos diarios:
        </p>

        {/* Spinner mientras se cargan las ramas */}
        {loadingRamas ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem 0", flex: 1 }}>
            <Oval height={40} width={40} color="#0A3D91" secondaryColor="#E2E8F0" strokeWidth={4} strokeWidthSecondary={4} ariaLabel="loading" />
          </div>
        ) : errorRamas ? (
          <div style={{ padding: "1rem", color: "#DC2626", textAlign: "center", fontSize: "0.9rem" }}>
            {errorRamas}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
            {desafioActual && (
              <div style={{
                backgroundColor: "#EFF6FF",
                border: "2px solid #3B82F6",
                borderRadius: "14px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                <div>
                  <small style={{ fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    Rama Actual en Progreso
                  </small>
                  <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.95rem" }}>
                    {desafioActual.nombre}
                  </div>
                </div>
              </div>
            )}

            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginTop: "0.75rem" }}>
              Ramas y Módulos de Ejercicios:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ramas.map((rama) => (
                <div
                  key={rama.id}
                  style={{
                    backgroundColor: rama.id === desafioActualId ? "#F0FDF4" : "#F8FAFC",
                    border: `1px solid ${rama.id === desafioActualId ? "#86EFAC" : "#E2E8F0"}`,
                    borderRadius: "12px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1E293B" }}>
                    {rama.nombre}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`/ejercicios/${rama.id}`);
                      }}
                      style={{
                        backgroundColor: "#0A3D91",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Ejercitar
                    </button>
                    {rama.id !== desafioActualId && (
                      <button
                        type="button"
                        onClick={() => cambiarDesafio(rama.id)}
                        disabled={cambiando}
                        title="Fijar como rama principal en el dashboard"
                        style={{
                          backgroundColor: "#E2E8F0",
                          color: "#475569",
                          border: "none",
                          borderRadius: "8px",
                          padding: "5px 8px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Fijar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginTop: "1rem" }}>
              Otras Secciones de Mate+:
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/mixto");
                }}
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <span>🎮</span>
                <span>Desafíos Mixtos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/ranking");
                }}
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <span>🥇</span>
                <span>Ranking</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/perfil");
                }}
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <span>👤</span>
                <span>Mi Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/configuracion");
                }}
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <span>⚙️</span>
                <span>Ajustes</span>
              </button>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
              <button
                type="button"
                onClick={irAConfigurarPerfil}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  backgroundColor: "#FFDB54",
                  color: "#0F172A",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255, 219, 84, 0.4)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <LuSparkles size={18} />
                <span>Cambiar Perfil y Tutor</span>
              </button>
              <small style={{ display: "block", textAlign: "center", color: "#64748B", fontSize: "0.75rem", marginTop: "6px" }}>
                Reconfigurá tus objetivos y elegí tu compañero
              </small>
            </div>
          </div>
        )}
      </aside>

      {/* ✅ Overlay con spinner mientras cambia de desafío */}
      {cambiando && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1001,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem 2.5rem",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Oval
              height={48}
              width={48}
              color="#111111"
              secondaryColor="#e0e0e0"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="cambiando-desafio"
            />
            <span style={{ color: "#333", fontSize: "1rem", fontWeight: 500 }}>
              Cambiando desafío...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarDesafios;