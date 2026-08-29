/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { LuBookText, LuX } from "react-icons/lu";
import { Oval } from "react-loader-spinner"; // ✅ Instalar: npm install react-loader-spinner
import api from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";
import "./SidebarDesafios.css";

const SidebarDesafios = ({ isOpen, onClose }) => {
  const { profile, refreshProfile } = useAuth();
  const [ramas, setRamas] = useState([]);
  const [cambiando, setCambiando] = useState(false);
  const [loadingRamas, setLoadingRamas] = useState(true); // ✅ Estado para carga de ramas
  const [errorRamas, setErrorRamas] = useState(null); // ✅ Estado para errores

  useEffect(() => {
    if (!isOpen) return;

    setLoadingRamas(true);
    setErrorRamas(null);

    api
      .get("/ramas")
      .then((res) => {
        setRamas(res.data || []);
        setLoadingRamas(false);
      })
      .catch((err) => {
        console.error("Error al cargar ramas:", err);
        setErrorRamas("Error al cargar los desafíos");
        setLoadingRamas(false);
      });
  }, [isOpen]);

  const desafioActualId = profile?.desafioActualId;
  const desafioActual = ramas.find((r) => r.id === desafioActualId);
  const otrasRamas = ramas.filter((r) => r.id !== desafioActualId);

  const cambiarDesafio = async (ramaId) => {
    if (cambiando || ramaId === desafioActualId) return;
    try {
      setCambiando(true);
      await api.patch("/usuarios/desafio-actual", { desafioActualId: ramaId });
      await refreshProfile();
      onClose();
    } catch (err) {
      console.error("Error al cambiar desafío:", err);
    } finally {
      setCambiando(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isOpen ? "320px" : "0px",
          zIndex: 1000,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          boxShadow: isOpen ? "2px 0 10px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateX(0)" : "translateX(-20px)",
            transition:
              "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            height: "100vh",
            width: "320px",
            padding: "1.5rem",
            paddingTop: "2rem",
          }}
        >
          <aside
            className={`sidebar-desafios ${isOpen ? "open" : ""}`}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
            }}
          >
            <button
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Cerrar menú"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <LuX size={24} />
            </button>

            <h2 className="sidebar-title">Desafíos</h2>
            <div className="sidebar-divider" />

            {/* ✅ Spinner mientras se cargan las ramas */}
            {loadingRamas ? (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem 0",
                flex: 1
              }}>
                <Oval
                  height={40}
                  width={40}
                  color="#111111"
                  secondaryColor="#cccccc"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                  ariaLabel="loading"
                />
                <span style={{ marginLeft: "0.75rem", color: "#666", fontSize: "0.9rem" }}>
                  Cargando desafíos...
                </span>
              </div>
            ) : errorRamas ? (
              // ✅ Mensaje de error
              <div style={{
                padding: "1rem",
                color: "#dc2626",
                textAlign: "center",
                fontSize: "0.9rem"
              }}>
                {errorRamas}
              </div>
            ) : (
              <>
                {desafioActual && (
                  <div className="sidebar-item active">
                    <div className="item-icon-wrapper">
                      <LuBookText size={20} color="#111111" />
                    </div>
                    <span className="item-text text-bold">
                      {desafioActual.nombre}
                    </span>
                  </div>
                )}

                <div className="sidebar-divider" />

                <p className="sidebar-subtitle">+ desafíos</p>

                <ul className="sidebar-list">
                  {otrasRamas.map((rama) => (
                    <li
                      key={rama.id}
                      className="sidebar-list-item"
                      onClick={() => cambiarDesafio(rama.id)}
                      style={{
                        cursor: cambiando ? "default" : "pointer",
                        opacity: cambiando ? 0.5 : 1,
                        pointerEvents: cambiando ? "none" : "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{rama.nombre}</span>
                      {/* ✅ Spinner pequeño en el item que se está cambiando */}
                      {cambiando && (
                        <Oval
                          height={16}
                          width={16}
                          color="#111111"
                          secondaryColor="#cccccc"
                          strokeWidth={5}
                          strokeWidthSecondary={5}
                          ariaLabel="cambiando"
                        />
                      )}
                    </li>
                  ))}
                </ul>

                {/* ✅ Si no hay otras ramas, mostrar mensaje */}
                {otrasRamas.length === 0 && !loadingRamas && (
                  <p style={{
                    color: "#999",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    padding: "1rem 0"
                  }}>
                    No hay otros desafíos disponibles
                  </p>
                )}
              </>
            )}
          </aside>
        </div>
      </div>

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