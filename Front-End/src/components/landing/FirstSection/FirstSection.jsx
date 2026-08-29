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
                                fontWeight: 500,
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                minHeight: isMobile ? '48px' : '56px',
                                width: isMobile ? '100%' : 'auto',
                                maxWidth: isMobile ? '300px' : 'auto',
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
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