import { Row, Col, Card, Button } from 'react-bootstrap';
import './FirstSection.css';
import { FaArrowRightLong } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useState, lazy, Suspense } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const ShapeSvg = lazy(() => import('../Components/Shape'));
const ShapeSvg1 = lazy(() => import('../Components/Shape1'));
const ShapeSvg2 = lazy(() => import('../Components/Shape2'));
const ShapeImage = lazy(() => import('../Components/Image'));

import BackgroundImage from '../../../assets/background.png?url';

const FirstSection = ({ navigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useMediaQuery('(max-width: 1200px)');

    return (
        <Row
            className="vh-100 g-0 flex-column-reverse flex-lg-row justify-content-start"
            id="inicio"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            {/* Columna izquierda - Decorativa */}
            <Col
                lg={6}
                className={`d-flex flex-1 align-items-center justify-content-center position-relative ${isMobile ? 'order-2' : 'order-1'}`}
                style={{ 
                    zIndex: 1,
                    minHeight: isMobile ? '50%' : 'auto'
                }}
            >
                <Suspense fallback={null}>
                    <ShapeSvg />
                    <ShapeSvg1 />
                    <ShapeSvg2 />
                    <ShapeImage />
                </Suspense>
            </Col>

            {/* Columna derecha - Contenido principal */}
            <Col
                lg={6}
                className={`d-flex flex-1 align-items-center justify-content-center ${isMobile ? 'order-1' : 'order-2'}`}
                style={{ 
                    zIndex: 2,
                    padding: isMobile ? '1rem 0' : '0',
                    flex: 1,
                    minHeight: isMobile ? '50%' : 'auto'
                }}
            >
                <Card
                    className="border-0 bg-transparent shadow-none"
                    style={{ width: '100%' }}
                >
                    <Card.Body className={`p-${isMobile ? '3' : '5'} d-flex align-items-center text-center text-lg-start align-items-lg-start flex-column gap-${isMobile ? '3' : '4'}`}>
                        <h1 
                            className="d-flex justify-content-center align-items-center title text-black text-uppercase"
                            style={{
                                fontSize: isMobile ? 'clamp(1.8rem, 5vw, 2.5rem)' : 'clamp(2.5rem, 4vw, 3.5rem)',
                                textAlign: isMobile ? 'center' : 'left'
                            }}
                        >
                            Aprendé Mate de Forma Divertida
                        </h1>

                        <p 
                            className="subtitle" 
                            style={{ 
                                color: '#333',
                                fontSize: isMobile ? 'clamp(0.9rem, 2vw, 1.1rem)' : 'clamp(1rem, 1.5vw, 1.3rem)',
                                textAlign: isMobile ? 'center' : 'left',
                                padding: isMobile ? '0 0.5rem' : '0'
                            }}
                        >
                            Dominá las herramientas matemáticas que realmente necesitás para tu día a día. Sin estrés, vos elegís cuándo y cómo avanzar.
                        </p>

                        {/* Tarjeta Explicativa del Tutor Bot IA */}
                        <div style={{
                            backgroundColor: "rgba(239, 246, 255, 0.92)",
                            border: "2px solid #93C5FD",
                            borderRadius: "16px",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            maxWidth: "520px",
                            boxShadow: "0 6px 18px rgba(37, 99, 235, 0.08)",
                            margin: "0.25rem 0",
                        }}>
                            <div style={{
                                fontSize: "1.8rem",
                                backgroundColor: "#DBEAFE",
                                borderRadius: "12px",
                                padding: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                🤖
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1E3A8A", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>Tutor Bot Inteligente en el Encabezado</span>
                                    <span style={{ backgroundColor: "#2563EB", color: "#FFFFFF", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "6px", fontWeight: 700 }}>IA 24/7</span>
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "#334155", margin: "2px 0 0 0", lineHeight: 1.35 }}>
                                    Hacé clic en el botón <strong>Tutor Bot</strong> o <strong>Calculadora</strong> arriba en la barra superior para recibir pistas paso a paso y resolver cualquier duda al instante.
                                </p>
                            </div>
                        </div>

                        {/* Badges Flotantes Dinámicos con Movimiento */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            justifyContent: isMobile ? "center" : "flex-start",
                            margin: "0.5rem 0",
                        }}>
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                                    backdropFilter: "blur(4px)",
                                    border: "1px solid #CBD5E1",
                                    borderRadius: "20px",
                                    padding: "6px 14px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: "#0F172A",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                }}
                            >
                                🏷️ Descuentos & Porcentajes
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                                    backdropFilter: "blur(4px)",
                                    border: "1px solid #CBD5E1",
                                    borderRadius: "20px",
                                    padding: "6px 14px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: "#0F172A",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                }}
                            >
                                🍽️ División de Cuentas
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                                    backdropFilter: "blur(4px)",
                                    border: "1px solid #CBD5E1",
                                    borderRadius: "20px",
                                    padding: "6px 14px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: "#0F172A",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                }}
                            >
                                ⚡ Agilidad Mental Diaria
                            </motion.div>
                        </div>

                        <Button
                            variant="primary"
                            size={isMobile ? 'md' : 'lg'}
                            className="rounded-pill d-flex align-items-center justify-content-center gap-3"
                            style={{
                                backgroundColor: "#FFDB54",
                                borderColor: "#FFDB54",
                                borderRadius: "35px",
                                fontSize: isMobile ? "clamp(0.9rem, 2.5vw, 1.2rem)" : "clamp(1rem, 1.5vw, 1.5rem)",
                                color: "#1a1a1a",
                                padding: isMobile ? "8px 30px" : "10px 40px",
                                fontWeight: 600,
                                boxShadow: "0px 6px 16px rgba(255, 219, 84, 0.4)",
                                minHeight: isMobile ? '48px' : '56px',
                                width: isMobile ? '100%' : 'auto',
                                maxWidth: isMobile ? '300px' : 'auto',
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                setIsHovered(true);
                                e.currentTarget.style.transform = "scale(1.04)";
                            }}
                            onMouseLeave={(e) => {
                                setIsHovered(false);
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => navigate('/login')}
                            aria-label="Comenzar a aprender matemáticas"
                        >
                            <motion.div
                                animate={{ rotate: isHovered ? 360 : 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                aria-hidden="true"
                                focusable="false"
                            >
                                <FaArrowRightLong style={{ color: "#1a1a1a", fontWeight: 500 }} />
                            </motion.div>
                            Comenzar
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default FirstSection;