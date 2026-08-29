import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Toast,
  ToastContainer,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../../src/components/layouts/header/Header.jsx";
import RecuperarContrasena from "./RecuperarContrasena.jsx";
const useLoginForm = () => {
  const { login, loginWithGoogle, googleLoading, loginAsDemoUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showRecuperar, setShowRecuperar] = useState(false);
  const [formError, setFormError] = useState("");
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    if (formError) setFormError("");
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      await loginAsDemoUser();
      setToastMessage("✅ ¡Ingresando como Usuario Registrado (Demo Adulto)!");
      setToastVariant("success");
      setShowToast(true);
    } catch (err) {
      console.error(err);
      setToastMessage("❌ Error al iniciar sesión demo.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      const msg = "Por favor, completá todos los campos";
      setFormError(msg);
      setToastMessage(`❌ ${msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const msg = "Ingresá un correo electrónico válido";
      setFormError(msg);
      setToastMessage(`❌ ${msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password, { rememberMe });
      setToastMessage("✅ ¡Inicio de sesión exitoso! Redirigiendo...");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const raw = error?.message || "";
      let msg = "Credenciales inválidas. Revisá tu email y contraseña.";
      if (/email not confirmed/i.test(raw)) {
        msg = "Confirmá tu email antes de iniciar sesión.";
      } else if (/too many|rate limit|429/i.test(raw)) {
        msg = "Demasiados intentos. Probá de nuevo en unos minutos.";
      }
      setFormError(msg);
      setToastMessage(`❌ ${msg}`);
      setToastVariant("danger");
      setShowToast(true);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Función para manejar login con Google
  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      await loginWithGoogle(redirectUrl);

      setToastMessage("🔗 Redirigiendo a Google...");
      setToastVariant("info");
      setShowToast(true);

      // La redirección la maneja Supabase
    } catch (error) {
      console.error("Error en login con Google:", error);
      setToastMessage(
        "❌ Error al iniciar sesión con Google. Intentá nuevamente.",
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    toastVariant,
    handleChangeValue,
    handleSubmit,
    handleGoogleLogin,
    handleDemoLogin,
    rememberMe,
    setRememberMe,
    loading,
    googleLoading,
    showRecuperar,
    setShowRecuperar,
    formError,
  };
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    toastVariant,
    handleChangeValue,
    handleSubmit,
    handleGoogleLogin,
    handleDemoLogin,
    rememberMe,
    setRememberMe,
    setEmail,
    loading,
    googleLoading,
    showRecuperar,
    setShowRecuperar,
    formError,
  } = useLoginForm();

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
          <Link to="/" style={{ position: "absolute", left: -70, top: 30 }}>
            <img
              src="/login/iconButton.png"
              alt="button"
              style={{ width: 50, height: 50 }}
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
              <span
                className="flex-grow-1 text-center pb-2 fw-bold"
                style={{
                  color: "#2D3E4E",
                  borderBottom: "3px solid #2D3E4E",
                  cursor: "default",
                }}
              >
                Iniciar sesión
              </span>
              <Link
                to="/register"
                className="flex-grow-1 text-center pb-2 text-decoration-none text-muted"
              >
                Registrarse
              </Link>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-3 w-100">
              <img
                src="/login/login.png"
                alt="login"
                style={{ width: 64, height: 64 }}
              />
            </div>
            <h3
              className="text-center fw-bold mb-4"
              style={{ fontSize: 24, fontWeight: 600 }}
            >
              ¡Qué bueno verte de vuelta!
            </h3>
            <Form method="post" action="#" onSubmit={handleSubmit} >
              {formError && (
                <Alert variant="danger" role="alert" className="py-2">
                  {formError}
                </Alert>
              )}
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label className="visually-hidden">Correo electrónico</Form.Label>
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
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={handleChangeValue}
                        aria-invalid={Boolean(formError)}
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
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label className="visually-hidden">Contraseña</Form.Label>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "4px" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Contraseña"
                      value={password}
                      onChange={handleChangeValue}
                      aria-invalid={Boolean(formError)}
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
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </div>
                </div>
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Recordarme en este dispositivo"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  variant="dark"
                  title="Si lo desmarcás, la sesión se cierra al cerrar el navegador"
                />
                <span
                  onClick={() => setShowRecuperar(true)}
                  className="text-decoration-none small"
                  style={{ color: "#2D3E4E", cursor: "pointer" }}
                >
                  Olvidé mi contraseña
                </span>
              </div>
              <Button
                variant="outline-secondary"
                type="submit"
                disabled={loading}
                className="w-100 rounded-pill fw-semibold mb-2 justify-content-center d-flex align-items-center gap-2"
                style={{ backgroundColor: "#FFFEFD", color: "#151515" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <img
                      src="/login/icon.png"
                      alt="Ingresar"
                      style={{ width: 18, height: 18 }}
                    />
                    Ingresar
                  </>
                )}
              </Button>
              <div className="d-flex align-items-center my-2">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">o</span>
                <hr className="flex-grow-1" />
              </div>
              <Button
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
              ¿No tenés cuenta?{" "}
              <Link
                to="/register"
                className="text-decoration-none"
                style={{ color: "#000000" }}
              >
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </Container>
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 1050, position: "fixed", top: "80px" }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <RecuperarContrasena
        show={showRecuperar}
        onHide={() => setShowRecuperar(false)}
      />
    </>
  );
};

export default LoginPage;
