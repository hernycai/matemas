import { useState } from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../header/header.css';
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '../../../../context/AuthContext';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import ButtonFloat from '../../../ui/ButtonFloat/ButtonFloat';
import fotoPerfilUser from '../../../../assets/Foto_perfil.png'; 

export default function Header({ showHeader, setShowHeader }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { logout, profile } = useAuth();
  const displayName = profile?.nombre?.trim() || profile?.email?.split("@")[0] || "Usuario";

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleHeader = () => {
    setShowHeader(!showHeader);
  };

  const handleLogout = async () => {
    // Salir de rutas protegidas antes de limpiar sesión para evitar salto a /login.
    navigate('/', { replace: true });
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  const handleSettings = () => {
    navigate('/configuracion');
  };

  return (
    <Navbar
      className="navbar-custom"
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container className="d-flex align-items-center px-4" style={{ justifyContent: 'space-between' }}>
        <Navbar.Brand onClick={() => navigate("/dashboard")} as={Link} className="brand">
          <svg width="141" height="30" viewBox="0 0 141 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.6178 28.6236C45.6113 27.1228 39.4583 26.9131 33.0924 28.572C31.5517 28.973 29.9361 28.0512 29.6017 26.4955C29.5451 26.2293 29.5268 25.9581 29.5567 25.6902C30.3321 18.6205 32.758 7.17479 38.0374 2.97854C40.8726 0.725678 44.583 0.970265 47.2252 3.48269C50.2767 6.38445 52.1186 11.3694 53.2351 15.6621C54.0903 18.9532 54.7209 22.2027 55.0986 25.5887C55.1635 26.1727 55.052 26.7268 54.8091 27.2076C54.2251 28.369 52.8807 28.938 51.6195 28.6236H51.6178Z" fill="#222227" />
            <path d="M129.561 24.2655C129.558 26.3569 127.904 27.8294 126.027 27.8794C124.15 27.9293 122.387 26.3752 122.343 24.332L122.295 21.9826C122.259 20.2273 120.71 18.7747 118.974 18.7348L116.447 18.6749C114.587 18.6316 113.206 16.9894 113.116 15.2707C113.026 13.5203 114.252 11.7799 116.134 11.5636L118.933 11.4787C120.683 11.4255 122.267 10.0112 122.297 8.22089L122.335 5.87818C122.368 3.84994 123.929 2.30422 125.876 2.2593C127.823 2.21437 129.533 3.69354 129.553 5.70847L129.575 7.88313C129.595 9.87144 131.117 11.4438 133.119 11.4904L135.603 11.5486C137.541 11.5952 138.837 13.4654 138.742 15.2607C138.646 17.0843 137.213 18.6533 135.28 18.6899L132.946 18.7348C130.981 18.7731 129.57 20.4353 129.566 22.3154L129.563 24.2638L129.561 24.2655Z" fill="#222227" stroke="#222227" strokeWidth="1.85686" strokeMiterlimit="10" />
            <path d="M21.1676 1.4624H20.6568C19.0395 1.4624 17.5554 2.06638 16.4206 3.05804C15.2859 4.0497 13.5089 4.0913 12.3292 3.05804C11.1495 2.02479 9.7103 1.4624 8.09303 1.4624H7.58223C4.02989 1.4624 1.12646 4.36583 1.12646 7.9165V22.4037C1.12646 25.9527 4.02989 28.8578 7.58056 28.8578H8.09137C11.1362 28.8578 13.7052 26.7197 14.3741 23.8712C15.043 26.7197 17.612 28.8578 20.6568 28.8578H21.1676C24.7166 28.8578 27.6217 25.9544 27.6217 22.4037V7.9165C27.6217 4.3675 24.7183 1.4624 21.1676 1.4624Z" fill="#222227" />
            <path d="M59.8721 1.54722C56.677 1.54722 54.0869 4.13735 54.0869 7.33244C54.0869 10.5275 56.677 13.1177 59.8721 13.1177L75.6971 13.1177C78.8922 13.1177 81.4823 10.5275 81.4823 7.33244C81.4823 4.13735 78.8922 1.54722 75.6971 1.54722L59.8721 1.54722Z" fill="#222227" />
            <path d="M89.3858 9.37437C86.1907 9.37437 83.6006 11.9645 83.6006 15.1596C83.6006 18.3547 86.1907 20.9448 89.3858 20.9448H105.211C108.406 20.9448 110.996 18.3547 110.996 15.1596C110.996 11.9645 108.406 9.37437 105.211 9.37437L89.3858 9.37437Z" fill="#222227" />
            <path d="M87.2361 1.47406C85.2283 1.47406 83.6006 3.10174 83.6006 5.10959C83.6006 7.11743 85.2283 8.74512 87.2361 8.74512L107.36 8.74512C109.368 8.74512 110.996 7.11743 110.996 5.10959C110.996 3.10174 109.368 1.47406 107.36 1.47406L87.2361 1.47406Z" fill="#222227" />
            <path d="M87.2344 21.5737C85.2266 21.5737 83.5989 23.2013 83.5989 25.2092C83.5989 27.217 85.2266 28.8447 87.2344 28.8447H107.359C109.367 28.8447 110.994 27.217 110.994 25.2092C110.994 23.2013 109.367 21.5737 107.359 21.5737H87.2344Z" fill="#222227" />
            <path d="M62.0003 22.9877C62.0003 26.1828 64.5905 28.7729 67.7856 28.7729C70.9807 28.7729 73.5708 26.1828 73.5708 22.9877V9.74343C73.5708 6.54833 70.9807 3.95819 67.7856 3.95819C64.5905 3.95819 62.0003 6.54833 62.0003 9.74343V22.9877Z" fill="#222227" />
          </svg>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="align-items-center justify-content-center">
          <Nav className="d-flex align-items-center gap-1 gap-lg-5 py-2 py-lg-0">
            <Nav.Link onClick={() => navigate("/dashboard")}>Desafíos</Nav.Link>
            <Nav.Link onClick={() => navigate("/mixto")}>Mixto</Nav.Link>
            <Nav.Link onClick={() => navigate("/ranking")}>Ranking</Nav.Link>
            <Nav.Link onClick={() => navigate("/perfil")}>Mi Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        
        <div className="hidden md:block d-flex align-items-center gap-2 gap-lg-3">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-user-menu"
              className="p-0 border-0"
            >
              <img
                src={fotoPerfilUser} 
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: 40, height: 40, objectFit: 'cover' }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-custom mt-2 shadow-lg" style={{ minWidth: '220px' }}>
              <Dropdown.Item onClick={handleProfile} className="py-2">
                <FaUser className="me-2" />
                {displayName}
              </Dropdown.Item>

              <Dropdown.Item onClick={handleSettings} className="py-2">
                <FaCog className="me-2" />
                Configuración
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                className="py-2 text-danger"
              >
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <ButtonFloat
          className="btn btn-primary"
          onClick={toggleHeader}
          style={{
            backgroundColor: showHeader ? '#FF6B6B' : '#FFDB54',
            border: 'none',
            top: "100%",
            right: 10,
            padding: "1rem",
            position: 'absolute',
            boxShadow: showHeader
              ? "0 8px 24px rgba(255, 107, 107, 0.4)"
              : "0 4px 16px rgba(0, 0, 0, 0.2)",
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '14px',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '14px',
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: showHeader ? "scale(1.05)" : "scale(1)",
            cursor: "pointer",
            minWidth: "auto",
          }}
          onMouseEnter={(e) => {
            if (!showHeader) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!showHeader) {
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          {showHeader ? (
            <LuChevronUp
              color="white"
              size={isMobile ? 16 : 24}
            />
          ) : (
            <LuChevronDown
              color="black"
              size={isMobile ? 16 : 24}
            />
          )}
        </ButtonFloat>
      </Container>
    </Navbar>
  );
}