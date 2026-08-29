import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

import Background from "../Images/fondo2.png";
import Register from "../Images/started/register.png";
import Login from "../Images/started/login.png";

const StartedPage = () => {
    const navigate = useNavigate();
    return (
        <Container
            fluid
            className="d-flex flex-column"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh'
            }}
        >
            <Row className="h-100 gap-0 align-items-center justify-content-center">
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h1 className="fw-bold display-1 d-flex justify-content-center align-items-center" style={{ color: '#2D3E4E' }}>
                        <svg
                            width="50"
                            height="55"
                            viewBox="0 0 50 55"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color='#31C976'
                            style={{
                                fontSize: 60,
                                marginTop: "auto",
                            }}
                        >
                            <path d="M32.7378 0H0V18.1696H21.21L0 41.8082L11.5278 54.6559L32.7378 31.0174V54.6559H49.0407V18.1696V0H32.7378Z" fill="#31C976" />
                        </svg>

                        <span style={{ fontSize: 120, color: "white" }}>MATE</span>
                        <span className="fw-black" style={{ fontSize: 100, fontWeight: '900', color: "white" }}>+</span>
                    </h1>
                </Col>
                <Row className="d-flex align-items-center justify-content-start h-50">
                    <Col sm={6} className="text-center text-white d-flex flex-column align-items-center justify-content-start" style={{ gap: '3rem' }}>
                        <img src={Login} alt="Login" style={{ width: "250px", height: "250px" }} />
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-50 py-2 rounded-pill fw-semibold"
                            style={{ backgroundColor: "#31C976", color: "white", borderColor: "#31C976", borderRadius: "35px", fontSize: "1.75rem" }}
                            onClick={() => navigate('/login')}
                        >
                            Tengo Cuenta
                        </Button>
                    </Col>
                    <Col sm={6} className="text-center text-white d-flex flex-column align-items-center" style={{ gap: '3rem' }}>
                        <img src={Register} alt="Register" style={{ width: "250px", height: "250px" }} />
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-50 py-2 rounded-pill fw-semibold"
                            style={{ backgroundColor: "#31C976", color: "white", borderColor: "#31C976", borderRadius: "35px", fontSize: "1.75rem" }}
                            onClick={() => navigate('/register')}
                        >
                            Crear cuenta
                        </Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}

export default StartedPage;