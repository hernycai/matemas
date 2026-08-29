import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { supabase } from "../config/supabaseClient";
import Header from "../components/layouts/header/Header";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasRecoverySession(Boolean(data.session));
      if (!data.session) {
        setError(
          "El enlace de recuperación no es válido o expiró. Pedí uno nuevo desde Iniciar sesión.",
        );
      }
      setReady(true);
    };
    checkSession();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setError(
        "La contraseña debe tener 8+ caracteres, una mayúscula, un número y un especial (! @ # $ % ^ & *).",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess("Contraseña actualizada. Ya podés iniciar sesión.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-5" style={{ maxWidth: 480 }}>
        <h1 className="h3 mb-3">Restablecer contraseña</h1>
        {!ready ? (
          <Spinner animation="border" />
        ) : (
          <>
            {error && (
              <Alert variant="danger" role="alert">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" role="status">
                {success}
              </Alert>
            )}
            {hasRecoverySession && !success && (
              <Form method="post" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmNewPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" disabled={loading} className="w-100">
                  {loading ? "Guardando..." : "Guardar contraseña"}
                </Button>
              </Form>
            )}
            <p className="mt-3 mb-0">
              <Link to="/login">Volver al inicio de sesión</Link>
            </p>
          </>
        )}
      </Container>
    </>
  );
};

export default ResetPassword;
