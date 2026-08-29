import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaDownload } from "react-icons/fa";
import usePWAInstall from '../hooks/usePWAInstall'; // Ajusta la ruta según tu estructura

const FirstSection = React.lazy(() => import('../components/landing/FirstSection/FirstSection'));
const SecondSection = React.lazy(() => import('../components/landing/SecondSection/SecondSection'));
const Introduction = React.lazy(() => import('../components/landing/Introduccion/Introduccion'));
const Footer = React.lazy(() => import('../components/layouts/Footer/Footer'));
const Header = React.lazy(() => import('../components/layouts/header/Header'));
const Banner = React.lazy(() => import('../components/landing/Components/Banner/Banner'));

const Landing = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [installHint, setInstallHint] = useState('');
    const { isInstallable, isInstalled, installApp } = usePWAInstall();

    useEffect(() => {
        const handleScroll = () => {
            const containerScroll = containerRef.current?.scrollTop ?? 0;
            const windowScroll = window.scrollY || document.documentElement.scrollTop || 0;
            setShowScrollTop(Math.max(containerScroll, windowScroll) > 250);
        };

        const container = containerRef.current;
        window.addEventListener('scroll', handleScroll, { passive: true });
        container?.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const hash = window.location.hash?.replace('#', '');
        if (!hash) return;
        const timer = setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!installHint) return;
        const timer = setTimeout(() => setInstallHint(''), 4500);
        return () => clearTimeout(timer);
    }, [installHint]);

    const scrollToTop = () => {
        const container = containerRef.current;
        if (container?.scrollTop > 0) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInstallClick = async () => {
        const result = await installApp();

        if (result === 'accepted') {
            setInstallHint('Instalación iniciada correctamente.');
            return;
        }

        if (result === 'dismissed') {
            setInstallHint('Instalación cancelada por el usuario.');
            return;
        }

        if (result === 'manual-ios') {
            setInstallHint('En iOS: Compartir > Agregar a pantalla de inicio.');
            return;
        }

        if (result === 'manual-browser') {
            setInstallHint(
                'Para instalar: Abre el menú del navegador (tres puntos) y selecciona "Instalar aplicación" o "Agregar a pantalla de inicio".'
            );
            return;
        }

        if (result === 'unavailable') {
            setInstallHint('Tu navegador no habilitó la instalación todavía.');
            return;
        }

        setInstallHint('No se pudo abrir la instalación. Intenta de nuevo.');
    };

    return (
        <>
            <Container ref={containerRef} fluid className="p-0 m-0 overflow-auto overflow-x-hidden" style={{ backgroundColor: "#F0F1EB" }}>
                <a href="#contenido-principal" className="skip-link">
                    Saltar al contenido
                </a>
                <Header />
                <main id="contenido-principal">
                    <FirstSection navigate={navigate} />
                    <Banner />
                    <Introduction />
                    <SecondSection />
                </main>
                <Footer />
            </Container>

            {/* Botón de Instalación PWA */}
            {!isInstalled && (
                <button
                    type="button"
                    onClick={handleInstallClick}
                    aria-label="Instalar aplicación"
                    title={isInstallable ? 'Instalar aplicacion' : 'Instalacion no disponible aun'}
                    style={{
                        position: 'fixed',
                        right: '40px',
                        bottom: '110px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontSize: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.22)',
                        zIndex: 1200,
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: 'pulse 2s infinite',
                        opacity: isInstallable ? 1 : 0.8,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <FaDownload />
                </button>
            )}

            {installHint && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: 'fixed',
                        right: '24px',
                        bottom: '182px',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                        zIndex: 1300,
                        maxWidth: '280px',
                        fontSize: '13px',
                        lineHeight: 1.3,
                    }}
                >
                    {installHint}
                </div>
            )}

            {/* Botón de Scroll al inicio (existente) */}
            {showScrollTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Volver al inicio"
                    style={{
                        position: 'fixed',
                        right: '40px',
                        bottom: '40px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: '#FFDB54',
                        color: 'black',
                        fontSize: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.22)',
                        zIndex: 1200,
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <FaArrowUp color="white" />
                </button>
            )}

            {/* Añadir la animación CSS para el botón de instalación */}
            <style>{`
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `}</style>
        </>
    );
}

export default Landing;