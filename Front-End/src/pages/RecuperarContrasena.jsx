import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { supabase } from "../config/supabaseClient";

const RecuperarContrasena = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setToastMessage("❌ Ingresá tu correo electrónico");
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
    setLoading(true);
    try {
      const siteUrl =
        import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${siteUrl.replace(/\/$/, "")}/reset-password`,
      });

      if (error) throw error;

      setToastMessage(
        "✅ Te enviamos un correo electrónico para restablecer tu contraseña",
      );
      setToastVariant("success");
      setShowToast(true);
      setEmail("");
      onHide();
    } catch (error) {
      setToastMessage(`❌ Error: ${error.message}`);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar contraseña</Modal.Title>
        </Modal.Header>
        <Form method="post" onSubmit={handleSubmit}>
          <Modal.Body>
            <p className="text-muted mb-3">
              Ingresá tu correo electrónico y te enviaremos un link para
              restablecer tu contraseña.
            </p>
            <Form.Group controlId="forgotEmail">
              <Form.Control
                type="email"
                autoComplete="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#2D3E4E", border: "none" }}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default RecuperarContrasena;
