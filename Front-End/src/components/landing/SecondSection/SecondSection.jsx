import { Container, Row, Col } from 'react-bootstrap';
import './SecondSection.css';

const steps = [
    {
        id: 1,
        stepNumber: "Paso 1",
        title: "Práctico y fácil de entender",
        subtitle: "Aprendé con ejercicios reales como compras, descuentos, precios y cuentas del día a día.",
        src: '/landing/step-1.png',
        alt: "Ilustración práctica y fácil de entender - Ejercicios de la vida cotidiana",
        floatClass: "graphic-float-1"
    },
    {
        id: 2,
        stepNumber: "Paso 2",
        title: "Explicado paso a paso",
        subtitle: "Videos claros y simples para ganar confianza resolviendo problemas cotidianos.",
        src: '/landing/step-2.png',
        alt: "Ilustración explicado paso a paso - Videos claros y simples",
        floatClass: "graphic-float-2"
    },
    {
        id: 3,
        stepNumber: "Paso 3",
        title: "Pensado para adultos",
        subtitle: "Una experiencia accesible y enfocada en aprender desde situaciones reales. ¡A tu propio ritmo y sin presiones!",
        src: '/landing/step-3.png',
        alt: "Ilustración pensado para adultos - Aprendizaje a tu ritmo sin presión",
        floatClass: "graphic-float-3"
    }
];

const SecondSection = () => {
    return (
        <div
            id="como-funciona"
            className="d-flex align-items-center justify-content-center"
        >
            <Container fluid="lg" className="como-funciona-container">
                {/* Encabezado compacto */}
                <div className="text-center mb-3 mb-md-4">
                    <span className="como-funciona-badge">
                        ¿CÓMO FUNCIONA?
                    </span>
                    <h2
                        className="fw-bold m-0"
                        style={{
                            fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)',
                            color: '#0A3D91',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Aprendé a tu ritmo en 3 simples pasos
                    </h2>
                </div>

                {/* 3 pasos en horizontal para que quepan en una sola pantalla */}
                <Row className="g-3 g-lg-4 justify-content-center align-items-stretch">
                    {steps.map((step) => (
                        <Col key={step.id} xs={12} md={4}>
                            <div id={`como-funciona-card-${step.id}`} className="como-funciona-card">
                                <span className="como-funciona-badge">
                                    {step.stepNumber}
                                </span>

                                {/* Gráfico con efecto aura y animación de flotación dinámica */}
                                <div id={`como-funciona-graphic-${step.id}`} className="como-funciona-graphic-wrapper">
                                    <div className="como-funciona-graphic-aura" />
                                    <img
                                        id={`como-funciona-img-${step.id}`}
                                        src={step.src}
                                        alt={step.alt}
                                        width="130"
                                        height="130"
                                        className={`como-funciona-graphic-img ${step.floatClass}`}
                                        loading="lazy"
                                    />
                                </div>

                                <h3
                                    className="fw-bold mb-2"
                                    style={{
                                        fontSize: 'clamp(1.05rem, 1.25vw, 1.25rem)',
                                        color: '#1A202C',
                                        lineHeight: 1.3
                                    }}
                                >
                                    {step.title}
                                </h3>

                                <p
                                    style={{
                                        fontSize: 'clamp(0.85rem, 0.95vw, 0.95rem)',
                                        color: '#4A5568',
                                        lineHeight: 1.5,
                                        margin: 0
                                    }}
                                >
                                    {step.subtitle}
                                </p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default SecondSection;