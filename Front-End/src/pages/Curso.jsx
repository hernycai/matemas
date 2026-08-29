import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const NotFoundPage = () => {
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState(0);

    const lecciones = [
        { id: 1, titulo: "LECCIÓN 1", descripcion: "Fundamentos del porcentaje", duracion: "15 min", emoji: "📊" },
        { id: 2, titulo: "LECCIÓN 2", descripcion: "Aplicaciones prácticas", duracion: "20 min", emoji: "📈" },
        { id: 3, titulo: "LECCIÓN 3", descripcion: "Porcentajes avanzados", duracion: "25 min", emoji: "🎯" }
    ];

    // Invertir el orden para que LECCIÓN 3 aparezca primero (como en la imagen)
    const leccionesInvertidas = [...lecciones].reverse();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Transform para el progreso del scroll
    const index = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 2]);

    useEffect(() => {
        const unsubscribe = index.onChange(value => {
            setCurrentIndex(Math.round(value));
        });
        return () => unsubscribe();
    }, [index]);

    // Manejar scroll con rueda del mouse
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.deltaY > 0 && currentIndex < leccionesInvertidas.length - 1) {
                setScrollDirection(1);
                setCurrentIndex(prev => Math.min(prev + 1, leccionesInvertidas.length - 1));
            } else if (e.deltaY < 0 && currentIndex > 0) {
                setScrollDirection(-1);
                setCurrentIndex(prev => Math.max(prev - 1, 0));
            }
            
            // Reset direction after animation
            setTimeout(() => setScrollDirection(0), 500);
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentIndex, leccionesInvertidas.length]);

    return (
        <div
            ref={containerRef}
            style={{
                height: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <div className="h-100 w-100 position-relative overflow-hidden">
                
                {/* Título ".PORCENTAJE" como en la imagen */}
                <div className="position-absolute top-0 start-0 end-0 z-3" style={{ padding: "2rem" }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-white" style={{ 
                            fontSize: "3rem", 
                            fontWeight: "bold",
                            letterSpacing: "2px",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                        }}>
                            .PORCENTAJE
                        </h1>
                    </motion.div>
                </div>

                {/* Título MÓDULO 1 y subtítulo */}
                <div className="text-center pt-5 position-relative z-3">
                    <motion.h2 
                        className="display-4 fw-bold text-white mb-3"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                    >
                        MODULO 1
                    </motion.h2>
                    <motion.p 
                        className="lead text-white-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ fontSize: "1.2rem" }}
                    >
                        ¿Quieres ver una lección antes de arrancar?
                    </motion.p>
                </div>

                {/* Lista vertical de tarjetas - estilo imagen */}
                <div className="position-relative h-75 d-flex flex-column align-items-center justify-content-center">
                    <div className="w-100" style={{ maxWidth: "500px", margin: "0 auto" }}>
                        
                        {/* Tarjeta 3 (superior) */}
                        <motion.div
                            className="card bg-success border-0 shadow-lg mb-3"
                            style={{
                                borderRadius: "1rem",
                                cursor: "pointer",
                                backgroundColor: "#28a745",
                                transformOrigin: "center",
                                opacity: currentIndex === 2 ? 1 : currentIndex > 2 ? 0.3 : 0.6
                            }}
                            animate={{
                                y: currentIndex === 2 ? 0 : 
                                    currentIndex === 1 ? -60 : 
                                    currentIndex === 0 ? -120 : -180,
                                scale: currentIndex === 2 ? 1 : 
                                       currentIndex === 1 ? 0.95 : 
                                       currentIndex === 0 ? 0.9 : 0.85,
                                opacity: currentIndex === 2 ? 1 : 
                                        currentIndex === 1 ? 0.7 : 
                                        currentIndex === 0 ? 0.4 : 0.2
                            }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: currentIndex === 2 ? 1.02 : 0.96 }}
                            onClick={() => setCurrentIndex(2)}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: "1.3rem" }}>
                                            LECCIÓN 3
                                        </h3>
                                        <p className="text-white-50 mb-0 small">Porcentajes avanzados</p>
                                    </div>
                                    <div className="bg-white bg-opacity-25 rounded-circle p-2">
                                        <span className="text-white">🎯</span>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                    <span className="text-white-50 small">⏱️ 25 min</span>
                                    <span className="badge bg-white bg-opacity-25 text-white px-3 py-1 rounded-pill small">
                                        Ver lección →
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tarjeta 2 (media) */}
                        <motion.div
                            className="card bg-success border-0 shadow-lg mb-3"
                            style={{
                                borderRadius: "1rem",
                                cursor: "pointer",
                                backgroundColor: "#20c997",
                                transformOrigin: "center"
                            }}
                            animate={{
                                y: currentIndex === 1 ? 0 : 
                                    currentIndex === 2 ? 60 : 
                                    currentIndex === 0 ? -60 : -120,
                                scale: currentIndex === 1 ? 1 : 
                                       currentIndex === 2 ? 0.95 : 
                                       currentIndex === 0 ? 0.95 : 0.9,
                                opacity: currentIndex === 1 ? 1 : 
                                        currentIndex === 2 ? 0.7 : 
                                        currentIndex === 0 ? 0.7 : 0.4
                            }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: currentIndex === 1 ? 1.02 : 0.96 }}
                            onClick={() => setCurrentIndex(1)}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: "1.3rem" }}>
                                            LECCIÓN 2
                                        </h3>
                                        <p className="text-white-50 mb-0 small">Aplicaciones prácticas</p>
                                    </div>
                                    <div className="bg-white bg-opacity-25 rounded-circle p-2">
                                        <span className="text-white">📈</span>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                    <span className="text-white-50 small">⏱️ 20 min</span>
                                    <span className="badge bg-white bg-opacity-25 text-white px-3 py-1 rounded-pill small">
                                        Ver lección →
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tarjeta 1 (inferior) */}
                        <motion.div
                            className="card bg-success border-0 shadow-lg"
                            style={{
                                borderRadius: "1rem",
                                cursor: "pointer",
                                backgroundColor: "#198754",
                                transformOrigin: "center"
                            }}
                            animate={{
                                y: currentIndex === 0 ? 0 : 
                                    currentIndex === 1 ? 60 : 
                                    currentIndex === 2 ? 120 : 180,
                                scale: currentIndex === 0 ? 1 : 
                                       currentIndex === 1 ? 0.95 : 
                                       currentIndex === 2 ? 0.9 : 0.85,
                                opacity: currentIndex === 0 ? 1 : 
                                        currentIndex === 1 ? 0.7 : 
                                        currentIndex === 2 ? 0.4 : 0.2
                            }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: currentIndex === 0 ? 1.02 : 0.96 }}
                            onClick={() => setCurrentIndex(0)}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: "1.3rem" }}>
                                            LECCIÓN 1
                                        </h3>
                                        <p className="text-white-50 mb-0 small">Fundamentos del porcentaje</p>
                                    </div>
                                    <div className="bg-white bg-opacity-25 rounded-circle p-2">
                                        <span className="text-white">📊</span>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                    <span className="text-white-50 small">⏱️ 15 min</span>
                                    <span className="badge bg-white bg-opacity-25 text-white px-3 py-1 rounded-pill small">
                                        Ver lección →
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Indicador de scroll */}
                <div className="position-absolute bottom-0 start-0 end-0 pb-4 z-3">
                    <motion.p 
                        className="text-white-50 small text-center animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{ letterSpacing: "1px" }}
                    >
                        ↓ SCROLL ↓
                    </motion.p>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(10px); opacity: 1; }
                }
                .animate-pulse {
                    animation: pulse 1.5s infinite;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
                * {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                .card {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default NotFoundPage;