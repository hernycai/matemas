import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Toast,
  ToastContainer,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../../src/components/layouts/header/Header";

const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, googleLoading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [genero, setGenero] = useState("");
  const [lugar, setLugar] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [anioNacimiento, setAnioNacimiento] = useState("");
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage("❌ Por favor, completá todos los campos");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setToastMessage("❌ Ingresá un correo electrónico válido");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setToastMessage(
        "❌ La contraseña debe tener 8+ caracteres, una mayúscula, un número y un especial (! @ # $ % ^ & *)",
      );
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    if (password !== confirmPassword) {
      setToastMessage("❌ Las contraseñas no coinciden");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    if (!acceptedTerms) {
      setToastMessage("❌ Debés aceptar los términos y condiciones");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    setShowProfileModal(true);
  };
  const handleCompleteProfile = async () => {
    if (!nombre || !genero) {
      setToastMessage("❌ Completá todos los campos del perfil");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    try {
      await register(email, password, nombre, {
        genero,
      });
      setToastMessage("✅ Registro exitoso");
      setToastVariant("success");
      setShowToast(true);
      setShowProfileModal(false);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      setToastMessage(`❌ Error: ${error.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return {
    nombre,
    setNombre,
    email,
    password,
    setEmail,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    rememberMe,
    setRememberMe,
    acceptedTerms,
    setAcceptedTerms,
    genero,
    setGenero,
    showProfileModal,
    setShowProfileModal,
    handleChangeValue,
    toastMessage,
    toastVariant,
    showToast,
    setShowToast,
    setToastMessage,
    setToastVariant,
    handleSubmit,
    handleCompleteProfile,
    loginWithGoogle,
    googleLoading,
  };
};

const RegisterPage = () => {
  const {
    nombre,
    setNombre,
    email,
    password,
    setEmail,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    rememberMe,
    setRememberMe,
    acceptedTerms,
    setAcceptedTerms,
    genero,
    setGenero,
    showProfileModal,
    setShowProfileModal,
    showToast,
    toastMessage,
    toastVariant,
    setShowToast,
    setToastMessage,
    setToastVariant,
    handleChangeValue,
    handleSubmit,
    handleCompleteProfile,
    loginWithGoogle,
    googleLoading,
  } = useRegisterForm();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(`${window.location.origin}/auth/callback`);
    } catch (error) {
      setToastMessage(
        "❌ Error al iniciar sesión con Google. Intentá nuevamente.",
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <Header />
     <Container
        fluid
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('/login/fondo.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#8FD8FD",
          backgroundSize: "contain",
          minHeight: "100vh",
          paddingTop: "100px",
          paddingBottom: "20px",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
          <Link
            to="/"
            className="d-none d-md-block"
            style={{
              position: "absolute",
              left: "-60px",
              top: "10px",
              zIndex: 10,
            }}
          >
            <img
              src="/login/iconButton.png"
              alt="Volver"
              style={{ width: 45, height: 45 }}
            />
          </Link>
          <div
            className="bg-white rounded-4 p-4"
            style={{
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            {/* Tabs */}
            <div className="d-flex border-bottom mb-4">
              <Link
                to="/login"
                className="flex-grow-1 text-center pb-2 text-decoration-none text-muted"
              >
                Iniciar sesión
              </Link>
              <span
                className="flex-grow-1 text-center pb-2 fw-bold"
                style={{
                  color: "#2D3E4E",
                  borderBottom: "3px solid #2D3E4E",
                  cursor: "default",
                }}
              >
                Registrarse
              </span>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-3 w-100">
              <img
                src="/login/registroform.png"
                alt="login"
                style={{ width: 64, height: 64 }}
              />
            </div>
            <h3
              className="text-center fw-bold mb-4"
              style={{ fontSize: 24, fontWeight: 600 }}
            >
              Bienvenido a MATE+
            </h3>
            <Form
              method="post"
              action="#"
              onSubmit={handleSubmit}
              className="px-2"
            >
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label className="visually-hidden">Email</Form.Label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "4px" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <InputGroup>
                      <Form.Control
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={handleChangeValue}
                        style={{
                          width: "100%",
                          backgroundColor: "#f5f5f5",
                          border: "none",
                          borderBottom: "1px solid #e0e0e0",
                          borderRadius: 0,
                          boxShadow: "none",
                          paddingRight: "10px",
                        }}
                      />
                    </InputGroup>
                    {email && (
                      <img
                        src="/login/icon2.png"
                        alt="Cerrar"
                        onClick={() => setEmail("")}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      visibility: "hidden",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaEye size={18} />
                  </div>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label className="visually-hidden">Contraseña</Form.Label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "4px" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder="Contraseña"
                      value={password}
                      onChange={handleChangeValue}
                      style={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        borderRadius: 0,
                        boxShadow: "none",
                        paddingRight: "10px",
                      }}
                    />
                    {/* ✕ borrar */}
                    {password && (
                      <img
                        src="/login/icon2.png"
                        alt="Borrar contraseña"
                        onClick={() => setPassword("")}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </div>
                  {/* 👁 mostrar/ocultar */}
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} aria-hidden="true" />
                    ) : (
                      <FaEye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerConfirmPassword">
                <Form.Label className="visually-hidden">
                  Repetir contraseña
                </Form.Label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "4px" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder="Repetir contraseña"
                      value={confirmPassword}
                      onChange={handleChangeValue}
                      style={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        borderRadius: 0,
                        boxShadow: "none",
                        paddingRight: "10px",
                      }}
                    />
                    {/* ✕ borrar */}
                    {confirmPassword && (
                      <img
                        src="/login/icon2.png"
                        alt="borrar"
                        onClick={() => setConfirmPassword("")}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </div>
                  {/* 👁 mostrar/ocultar */}
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar repetición de contraseña"
                        : "Mostrar repetición de contraseña"
                    }
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={18} aria-hidden="true" />
                    ) : (
                      <FaEye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </Form.Group>
              {/* Recordarme / Olvidé contraseña */}
              <div className=" mb-3">
                {/*  <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Recordarme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  variant="dark"
                  className="small"
                /> */}
                <Form.Check
                  type="checkbox"
                  id="acceptedTerms"
                  label="He leído y acepto los términos y condiciones de uso"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  variant="dark"
                  className="small"
                />
              </div>
              {/* Botón ingresar */}
              <Button
                variant="outline-secondary"
                type="submit"
                className="w-100 rounded-pill fw-semibold mb-2 justify-content-center d-flex align-items-center gap-2"
                style={{ backgroundColor: "#FFFEFD", color: "#151515" }}
              >
                <img
                  src="/login/icon.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: 18, height: 18 }}
                />
                Registrarse
              </Button>
              {/* Separador */}
              <div className="d-flex align-items-center my-2">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">o</span>
                <hr className="flex-grow-1" />
              </div>
              {/* Google */}
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-100 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ borderColor: "#ddd" }}
              >
                {googleLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Conectando con Google...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path
                          d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
                          fill="#EA4335"
                        />
                        <path
                          d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                          fill="#4285F4"
                        />
                        <path
                          d="M3.88 10.78A5.44 5.44 0 0 1 3.6 9c0-.62.1-1.22.28-1.78L.97 4.96A9.06 9.06 0 0 0 0 9c0 1.45.35 2.82.97 4.04l2.91-2.26z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74l-2.91 2.26C2.44 15.98 5.48 18 9 18z"
                          fill="#34A853"
                        />
                      </g>
                    </svg>
                    Iniciar sesión con Google
                  </>
                )}
              </Button>
            </Form>
            <p className="text-center mt-3 small text-muted">
              ¿Ya sos usuario?{" "}
              <Link
                to="/login"
                className="text-decoration-none "
                style={{ color: "#000000" }}
              >
                Ingresá
              </Link>
            </p>
          </div>
        </div>
      </Container>
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 99999, position: "fixed", top: "80px" }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className={"text-white"}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <div className="  position-relative width-100">
          <img
            src="/login/fmodal2.png"
            alt="fondomodal2"
            style={{
              width: 100,
              height: 100,
              position: "absolute",
              top: "15px",
              right: "10px",
            }}
          />
          <img
            src="/login/fmodal.png"
            alt="fondomodal"
            style={{
              width: 100,
              height: 100,
              position: "absolute",
              top: "5px",
              left: "10px",
            }}
          />
        </div>
        <Modal.Body className="p-4">
          <div className="text-center mb-3">
            <img
              src="/login/registro.png"
              alt="perfil"
              style={{ width: 64, height: 64 }}
            />
          </div>
          <h4 className="text-center fw-bold mb-4">Completa tu perfil</h4>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                border: "none",
                borderBottom: "1px solid #e0e0e0",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              style={{
                border: "none",
                borderBottom: "1px solid #e0e0e0",
                borderRadius: 0,
                boxShadow: "none",
              }}
            >
              <option value="">Género</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </Form.Select>
          </Form.Group>
          <Button
            className="w-100 rounded-pill fw-semibold"
            style={{ backgroundColor: "#2D2D2D", borderColor: "#2D2D2D" }}
            onClick={handleCompleteProfile}
          >
            Comenzar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterPage;
