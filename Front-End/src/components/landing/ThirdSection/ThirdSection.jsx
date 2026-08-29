import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { teamData } from '../../../data/TeamData';
import './ThirdSection.css';

const ThirdSection = () => {
    const [loadedImages, setLoadedImages] = useState({});
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // ✅ Intersection Observer para cargar imágenes solo cuando la sección es visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // ✅ Precarga las imágenes cuando la sección es visible
                        teamData.forEach(item => {
                            const img = new Image();
                            img.src = item.src;
                        });
                        observer.disconnect();
                    }
                });
            },
            { 
                rootMargin: '200px', // ✅ Comienza a cargar 200px antes
                threshold: 0.1 
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Container 
            fluid 
            className="py-5" 
            id="nosotros"
            ref={sectionRef}
        >
            {/* ✅ Título con mejor contraste y tamaño responsive */}
            <Row className="justify-content-center mb-5">
                <Col md={8} className="text-center">
                    <h2 
                        className="fw-bold mb-3" 
                        style={{ 
                            color: '#1a1a2e', // ✅ Mejor contraste
                            fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                            lineHeight: 1.2,
                        }}
                    >
                        Proyecto presentado por Equipo 8 Innova Lab
                    </h2>
                </Col>
            </Row>

            <Container>
                <Row className="justify-content-center d-flex g-4">
                    {teamData.map((dpto) => (
                        <Col 
                            key={dpto.title} 
                            md={6} 
                            lg={4} 
                            className="mb-4 d-flex align-items-center justify-content-center flex-column"
                        >
                            {/* ✅ Card con mejor accesibilidad y rendimiento */}
                            <Card 
                                className="shadow-lg team-card"
                                style={{ 
                                    borderColor: "#31C976", 
                                    borderWidth: '10px',
                                    marginBottom: '1rem',
                                    height: 'clamp(200px, 25vw, 300px)',
                                    width: '75%',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                {/* ✅ Imagen optimizada con lazy loading */}
                                <img
                                    src={isVisible ? dpto.src : undefined}
                                    alt={`Equipo de ${dpto.title} - Mate+`}
                                    loading="lazy"
                                    decoding="async"
                                    width="400"
                                    height="400"
                                    className="team-image"
                                    style={{ 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        margin: '0 auto',
                                        width: '100%',
                                        // ✅ Fade-in al cargar
                                        opacity: loadedImages[dpto.title] ? 1 : 0,
                                        transition: 'opacity 0.6s ease',
                                    }}
                                    onLoad={() => {
                                        setLoadedImages(prev => ({
                                            ...prev,
                                            [dpto.title]: true
                                        }));
                                    }}
                                    onError={(e) => {
                                        // ✅ Fallback si la imagen no carga
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%2331C976"/%3E%3Ctext x="200" y="200" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="sans-serif"%3E%3C/t%3E%3C/svg%3E';
                                    }}
                                />
                                
                                {/* ✅ Placeholder mientras carga */}
                                {!loadedImages[dpto.title] && isVisible && (
                                    <div 
                                        className="team-placeholder"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#6c757d',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        <span>Cargando...</span>
                                    </div>
                                )}
                            </Card>

                            {/* ✅ Título del departamento con mejor contraste */}
                            <h5 
                                className="text-center mt-2" 
                                style={{ 
                                    fontSize: 'clamp(1.2rem, 2vw, 2rem)',
                                    color: '#1a1a2e',
                                    fontWeight: 600,
                                }}
                            >
                                {dpto.title}
                            </h5>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};

export default ThirdSection;