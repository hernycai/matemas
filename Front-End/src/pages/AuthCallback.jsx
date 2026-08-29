import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [, setProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
                const oauthError =
                    params.get('error_description') ||
                    params.get('error') ||
                    hashParams.get('error_description') ||
                    hashParams.get('error');

                if (oauthError) {
                    setError(
                        decodeURIComponent(oauthError).replace(/\+/g, ' ') ||
                        'No se pudo completar el inicio de sesión con Google',
                    );
                    setProcessing(false);
                    return;
                }

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    setError('Error al obtener la sesión');
                    setProcessing(false);
                    return;
                }

                if (session?.user) {
                    setTimeout(() => {
                        navigate('/onboarding', { replace: true });
                    }, 800);
                } else {
                    setError('No se pudo completar el inicio de sesión con Google');
                    setProcessing(false);
                }
            } catch (err) {
                setError(err.message || 'Error al procesar la autenticación');
                setProcessing(false);
            }
        };

        handleCallback();
    }, [navigate]);

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center" style={{ maxWidth: 420 }}>
                    <Alert variant="danger" role="alert">
                        <Alert.Heading>No se pudo iniciar sesión</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                    <Button as={Link} to="/login" variant="primary">
                        Volver al login e intentar de nuevo
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4 className="mt-4">Procesando autenticación con Google</h4>
                <p className="text-muted">Por favor esperá...</p>
            </div>
        </Container>
    );
};

export default AuthCallback;
