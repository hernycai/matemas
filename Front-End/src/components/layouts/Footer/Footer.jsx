import { Row, Col, Nav } from 'react-bootstrap';
import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleScrollToSection = (sectionId) => {
        if (window.location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <footer id="footer-principal" className="footer-wrapper" role="contentinfo">
            <div className="footer">
                <Row className="align-items-center justify-content-between w-100 gy-3">
                    {/* Marca y propósito resumido */}
                    <Col xs={12} md={6} lg={5}>
                        <div className="d-flex align-items-center gap-3">
                            <img
                                id="footer-logo"
                                src="/logo.png"
                                alt="Logo de MATE+"
                                className="footer-logo-compact"
                            />
                            <div>
                                <h3 className="footer-brand-title m-0">MATE+</h3>
                                <p className="footer-tagline m-0">
                                    Matemática práctica y cotidiana para potenciar tu día a día.
                                </p>
                            </div>
                        </div>
                    </Col>

                    {/* Enlaces de navegación rápida */}
                    <Col xs={12} md={6} lg={6}>
                        <Nav className="justify-content-center justify-content-md-end align-items-center gap-3 gap-lg-4 flex-wrap">
                            <Nav.Link
                                id="footer-nav-about"
                                onClick={() => handleScrollToSection("about")}
                                href="/#about"
                                className="footer-link"
                            >
                                ¿Qué es MATE+?
                            </Nav.Link>
                            <Nav.Link
                                id="footer-nav-nosotros"
                                as={Link}
                                to="/nosotros"
                                className="footer-link"
                            >
                                Sobre nosotros
                            </Nav.Link>
                            <Link
                                id="footer-nav-privacidad"
                                to="/privacidad"
                                state={{ tab: 'privacidad' }}
                                className="footer-link"
                            >
                                Privacidad
                            </Link>
                            <Link
                                id="footer-nav-terminos"
                                to="/terminos"
                                state={{ tab: 'terminos' }}
                                className="footer-link"
                            >
                                Términos
                            </Link>
                        </Nav>
                    </Col>
                </Row>

                <div className="footer-divider" />

                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start gap-1">
                    <p className="footer-copyright m-0">
                        © {currentYear} MATE+. Todos los derechos reservados.
                    </p>
                    <span className="footer-subtext m-0">
                        Aprende sin apuros, a tu propio ritmo.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
