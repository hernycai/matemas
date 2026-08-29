import '../FirstSection/FirstSection.css';
import { Container, Stack, Row, Col } from 'react-bootstrap';

const steps = [
    {
        id: 1,
        title: "Práctico y fácil de entender",
        subtitle: "Aprendé con ejercicios reales como compras, descuentos, precios y cuentas del día a día.",
        src: '/landing/step-1.png',
        alt: "Ilustración práctica y fácil de entender - Ejercicios de la vida cotidiana"
    },
    {
        id: 2,
        title: "Explicado paso a paso",
        subtitle: "Videos claros y simples para ganar confianza resolviendo problemas cotidianos.",
        src: '/landing/step-2.png',
        alt: "Ilustración explicado paso a paso - Videos claros y simples"
    },
    {
        id: 3,
        title: "Pensado para adultos",
        subtitle: "Una experiencia accesible y enfocada en aprender desde situaciones reales. Sin apuros ni presión. ¡A tu ritmo!",
        src: '/landing/step-3.png',
        alt: "Ilustración pensado para adultos - Aprendizaje a tu ritmo sin presión"
    }
];

const SecondSection = () => {
    return (
        <Container
            fluid
            className="p-5"
            style={{ backgroundColor: '#FFFEFD' }}
            id="como-funciona"
        >
            <Stack gap={0}>
                {steps.map((step, index) => (
                    <Row
                        key={step.id}
                        className={`align-items-center justify-content-around gap-2 ${index % 2 === 1 ? 'flex-row-reverse' : ''
                            }`}
                        style={{ marginBottom: '3rem' }}
                    >
                        {/* ✅ Columna de texto con mejor contraste */}
                        <Col lg={6} className="text-center text-lg-start">
                            <h3
                                className="text-uppercase fw-bold mb-3"
                                style={{
                                    fontSize: 'clamp(1.8rem, 4vw, 3.75rem)', // 28px → 60px
                                    color: 'black',
                                    fontWeight: 600,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                {step.title}
                            </h3>
                            <p
                                className="lead"
                                style={{
                                    fontSize: 'clamp(1rem, 1.8vw, 2rem)', // 16px → 30px
                                    color: '#000000',
                                    fontWeight: 400,
                                }}
                            >
                                {step.subtitle}
                            </p>
                        </Col>

                        <Col lg={4} className="text-center">
                            <img
                                src={step.src}
                                alt={step.alt}
                                width="300"
                                height="300"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    transition: 'opacity 0.5s ease',
                                }}
                            />
                        </Col>
                    </Row>
                ))}
            </Stack>
        </Container>
    );
};

export default SecondSection;