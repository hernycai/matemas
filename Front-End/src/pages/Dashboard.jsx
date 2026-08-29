import "./Dashboard.css";
import { Container } from "react-bootstrap";
import HeaderDash from '../components/layouts/Desafios/headerDash/HeaderDash';
import { LuBookText } from "react-icons/lu";
import { FaCalculator, FaComments } from "react-icons/fa";
import ButtonFloat from "../components/ui/ButtonFloat/ButtonFloat";
import CursoSection from "../components/cursos/Section";
import { useMediaQuery } from "../hooks/useMediaQuery";
import FooterDash from "../components/layouts/FooterDash/FooterDash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderSection from "../components/layouts/HeaderDashboardCollapse/HeaderDashboardCollapse";
import SidebarEscenarios from "../components/layouts/SidebarDesafios/SidebarDesafios";
import ModalCalculadora from "../components/layouts/Calculadora/Calculadora.jsx";
import { useMascotContext } from "../mascotas/core/MascotProvider";

const DashboardPage = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const location = useLocation();
    const [showHeader, setShowHeader] = useState(Boolean(location.state?.openRewards));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isOpenCalculator, setIsOpenCalculator] = useState(false);
    const [rewardPulse, setRewardPulse] = useState(location.state?.rewardPulse || null);
    const { openChat } = useMascotContext();

    useEffect(() => {
        if (!location.state?.openRewards) return;
        setShowHeader(true);
        setRewardPulse(location.state.rewardPulse || null);
        // Limpiar state para no reabrir al refrescar
        window.history.replaceState({}, document.title);
    }, [location.state]);

    return (
        <main style={{
            backgroundColor: "#A3DFFD",
            minHeight: "100vh",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative"
        }}>
            <ModalCalculadora
                isOpen={isOpenCalculator}
                onClose={() => setIsOpenCalculator(false)}
            />

            <HeaderDash showHeader={showHeader} setShowHeader={setShowHeader} />
            
            {/* 👈 Menú Lateral Deslizante desde la Izquierda */}
            <SidebarEscenarios 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <Container
                fluid
                className="d-flex align-items-start justify-content-between gap-0 flex-column text-white"
                style={{
                    height: "calc(100vh - 90px)",
                    width: '100%',
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingBottom: "1rem",
                    position: 'relative',
                    marginTop: "auto",
                    overflowY: "auto",
                }}
            >
                {/* Header Section con animación de despliegue */}
                <div style={{
                    display: "grid",
                    gridTemplateRows: showHeader ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    marginBottom: showHeader ? "1rem" : "0",
                    width: "100%"
                }}>
                    <div style={{
                        overflow: "hidden",
                        opacity: showHeader ? 1 : 0,
                        transform: showHeader ? "translateY(0)" : "translateY(-20px)",
                        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}>
                        <HeaderSection isOpen={showHeader} animateRewards={Boolean(rewardPulse)} />
                    </div>
                </div>

                {/* Curso Section */}
                <CursoSection />

                {!isMobile && <FooterDash />}

                {/* Botón Flotante Lateral Izquierdo: Libro / Escenarios */}
                <ButtonFloat
                    onClick={() => setIsSidebarOpen(true)}
                    className="btn btn-primary"
                    style={{
                        height: '56px',
                        backgroundColor: '#FFDB54',
                        border: 'none',
                        top: "45%",
                        left: 0,
                        padding: "0 1.25rem 0 1rem",
                        position: 'fixed',
                        boxShadow: "2px 6px 16px rgba(0, 0, 0, 0.15)",
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0',
                        borderTopRightRadius: '14px',
                        borderBottomRightRadius: '14px',
                        zIndex: 1500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    title="Ver escenarios y módulos"
                    aria-label="Abrir menú de módulos y escenarios"
                >
                    <LuBookText color="#1E293B" size={28} />
                </ButtonFloat>

                {/* Botones Flotantes Laterales Derechos: Tutor Bot & Calculadora */}
                <div style={{
                    position: "fixed",
                    bottom: isMobile ? "2rem" : "3rem",
                    right: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    zIndex: 1100,
                    pointerEvents: "auto"
                }}>
                    {/* Botón Calculadora */}
                    <button
                        type="button"
                        onClick={() => setIsOpenCalculator(true)}
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            backgroundColor: "#0A3D91",
                            color: "#ffffff",
                            border: "2px solid #ffffff",
                            boxShadow: "0 4px 14px rgba(10, 61, 145, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        title="Abrir Calculadora Cotidiana"
                        aria-label="Abrir Calculadora Cotidiana"
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        <FaCalculator size={20} />
                    </button>

                    {/* Botón Tutor Bot */}
                    <button
                        type="button"
                        onClick={() => openChat()}
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            backgroundColor: "#FFDB54",
                            color: "#0A3D91",
                            border: "2px solid #ffffff",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        title="Consultar al Tutor Matemático"
                        aria-label="Consultar al Tutor Matemático"
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        <FaComments size={26} />
                    </button>
                </div>
            </Container>
        </main>
    );
};

export default DashboardPage;