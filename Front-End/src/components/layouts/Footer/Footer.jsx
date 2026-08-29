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
        <footer className="footer-wrapper" role="contentinfo">
            <div className="footer">
                <Row className="justify-content-between w-100">
                    <Col xs={12} sm={12} md={12} lg={4} className="mb-4 mb-lg-0">
                        <div className="footer-section d-flex align-items-center align-items-lg-start flex-column gap-3">
                            <img
                                src="/logo.png"
                                alt="Logo de MATE+"
                                style={{ width: 100, height: 'auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', borderRadius: '100%' }}
                            />
                            <p className="footer-location w-75 text-center text-lg-start">
                                Nuestra visión es hacerte el aprendizaje más fácil y ayudarte a dominar las matemáticas que necesitás para potenciar tu día a día.
                            </p>
                            {/* Sin perfiles oficiales todavía: no linkear a homes genéricas */}
                            <p className="footer-location w-75 text-center text-lg-start mb-0" style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                                Seguinos pronto en redes — perfiles oficiales en camino.
                            </p>
                        </div>
                    </Col>

                    <Col xs={4} sm={4} md={4} lg={2}>
                        <Nav className="footer-section d-flex align-items-center flex-column gap-2">
                            <p className="footer-social-title m-0">Acerca</p>
                            <Nav.Link
                                onClick={() => handleScrollToSection("about")}
                                href="/#about"
                                className="footer-link"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                ¿Qué es MATE+?
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/nosotros"
                                className="footer-link"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Sobre nosotros
                            </Nav.Link>
                        </Nav>
                    </Col>

                    <Col xs={4} sm={4} md={4} lg={2}>
                        <div className="footer-section d-flex align-items-center flex-column gap-2">
                            <p className="footer-social-title m-0">Comunidad</p>
                            <span className="footer-link footer-link-disabled" title="Próximamente">
                                Foro (próximamente)
                            </span>
                            <span className="footer-link footer-link-disabled" title="Próximamente">
                                Blog (próximamente)
                            </span>
                        </div>
                    </Col>

                    <Col xs={4} sm={4} md={4} lg={2}>
                        <div className="footer-section d-flex flex-column align-items-center align-items-lg-end gap-2">
                            <p className="footer-social-title m-0">Redes</p>
                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                LinkedIn
                            </a>
                            <Link to="/nosotros" className="footer-link">
                                Equipo 8
                            </Link>
                        </div>
                    </Col>
                </Row>

                <div className="w-100 my-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.15)' }} />

                <Row className="w-100 align-items-center">
                    <Col xs={12} md={6} className="text-center text-md-start">
                        <p className="footer-copyright">
                            © {currentYear} Mate+. Todos los derechos reservados.
                        </p>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end gap-4 gap-md-5 mt-2 mt-md-0">
                        <Link
                            to="/privacidad"
                            state={{ tab: 'privacidad' }}
                            className="footer-copyright footer-legal-link"
                        >
                            Política de Privacidad
                        </Link>
                        <Link
                            to="/terminos"
                            state={{ tab: 'terminos' }}
                            className="footer-copyright footer-legal-link"
                        >
                            Términos y Condiciones
                        </Link>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
