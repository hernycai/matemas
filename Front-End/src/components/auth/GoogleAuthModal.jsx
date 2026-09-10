import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaUserPlus, FaChevronRight, FaShieldAlt } from "react-icons/fa";

function GoogleAuthModal({ isOpen, onClose, onSelectAccount, loading = false }) {
  const [modoManual, setModoManual] = useState(false);
  const [customNombre, setCustomNombre] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [errorInput, setErrorInput] = useState("");

  const cuentasSugeridas = [
    {
      id: "admin-009",
      nombre: "Luciano",
      email: "hluciano@gmail.com",
      badge: "Administrador Mate+",
      color: "#1a73e8",
      inicial: "L",
    },
    {
      id: "demo-adult-user-01",
      nombre: "María Gómez",
      email: "maria.adulta@matemas.com",
      badge: "Estudiante Adulto (Demo)",
      color: "#0d9488",
      inicial: "M",
    },
  ];

  const handleSeleccionar = (cuenta) => {
    onSelectAccount(cuenta);
  };

  const handleSubmitManual = (e) => {
    e.preventDefault();
    setErrorInput("");

    if (!customEmail.trim()) {
      setErrorInput("Ingresá un correo de Google válido.");
      return;
    }

    const emailLimpio = customEmail.trim().toLowerCase();
    if (!emailLimpio.includes("@")) {
      setErrorInput("Por favor, ingresá una dirección de correo válida.");
      return;
    }

    const nombreLimpio =
      customNombre.trim() ||
      emailLimpio.split("@")[0].charAt(0).toUpperCase() +
        emailLimpio.split("@")[0].slice(1);

    onSelectAccount({
      id: `google-${emailLimpio.replace(/[^a-zA-Z0-9]/g, "_")}`,
      nombre: nombreLimpio,
      email: emailLimpio,
      badge: "Cuenta de Google",
      color: "#ea4335",
      inicial: nombreLimpio.charAt(0).toUpperCase(),
    });
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={!loading}
      className="google-auth-modal"
    >
      <Modal.Body style={{ padding: "2rem", borderRadius: "16px", backgroundColor: "#ffffff" }}>
        {/* Encabezado con Logotipo Oficial de Google */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-2 rounded-circle bg-light mb-2">
            <svg width="32" height="32" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          <h4 className="fw-bold mb-1" style={{ color: "#202124", fontSize: "1.35rem" }}>
            Acceder con Google
          </h4>
          <p className="text-muted small mb-0">
            Elegí una cuenta para continuar en <strong>Mate+</strong>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" style={{ width: "2.5rem", height: "2.5rem" }} />
            <p className="mt-3 text-secondary fw-semibold">Iniciando sesión segura con Google...</p>
          </div>
        ) : (
          <>
            {!modoManual ? (
              <div className="d-flex flex-column gap-2 mb-3">
                {cuentasSugeridas.map((cuenta) => (
                  <button
                    key={cuenta.email}
                    type="button"
                    onClick={() => handleSeleccionar(cuenta)}
                    className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between border"
                    style={{
                      backgroundColor: "#f8fafc",
                      borderColor: "#e2e8f0",
                      transition: "all 0.15s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                      e.currentTarget.style.borderColor = "#94a3b8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor: cuenta.color,
                          fontSize: "1.1rem",
                        }}
                      >
                        {cuenta.inicial}
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: "#1e293b", fontSize: "0.95rem" }}>
                          {cuenta.nombre}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                          {cuenta.email}
                        </div>
                        <span
                          className="badge mt-1"
                          style={{
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                          }}
                        >
                          {cuenta.badge}
                        </span>
                      </div>
                    </div>
                    <FaChevronRight className="text-muted" size={14} />
                  </button>
                ))}

                {/* Opción de usar otra cuenta de Google */}
                <button
                  type="button"
                  onClick={() => setModoManual(true)}
                  className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between border"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderStyle: "dashed",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-secondary bg-light"
                      style={{ width: "42px", height: "42px" }}
                    >
                      <FaUserPlus size={16} />
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ color: "#334155", fontSize: "0.92rem" }}>
                        Usar otra cuenta de Google
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                        Ingresar tu correo electrónico @gmail.com
                      </div>
                    </div>
                  </div>
                  <FaChevronRight className="text-muted" size={14} />
                </button>
              </div>
            ) : (
              <Form onSubmit={handleSubmitManual} className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">
                    Nombre o Apodo:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej. Luciano"
                    value={customNombre}
                    onChange={(e) => setCustomNombre(e.target.value)}
                    className="rounded-3"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">
                    Correo de Google (@gmail.com):
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      if (errorInput) setErrorInput("");
                    }}
                    className="rounded-3"
                    required
                  />
                  {errorInput && (
                    <div className="text-danger small mt-1">{errorInput}</div>
                  )}
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    className="w-50 rounded-pill"
                    onClick={() => setModoManual(false)}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-50 rounded-pill fw-semibold"
                    style={{ backgroundColor: "#1a73e8", borderColor: "#1a73e8" }}
                  >
                    Continuar
                  </Button>
                </div>
              </Form>
            )}

            <div className="d-flex align-items-center gap-2 pt-2 border-top text-muted" style={{ fontSize: "0.75rem" }}>
              <FaShieldAlt className="text-primary flex-shrink-0" size={14} />
              <span>
                Para continuar, Google compartirá tu nombre y dirección de correo con Mate+ de forma segura.
              </span>
            </div>
          </>
        )}
      </Modal.Body>
      {!loading && (
        <Modal.Footer style={{ borderTop: "none", padding: "0 2rem 1.5rem 2rem", justifyContent: "center" }}>
          <Button variant="link" className="text-secondary text-decoration-none small" onClick={onClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default GoogleAuthModal;
