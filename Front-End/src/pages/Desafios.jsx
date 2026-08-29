import { useEffect, useState } from 'react';
import VideoPage from '../components/layouts/VideoPage/VideoPage';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Desafios() {
  const navigate = useNavigate();
  const { seccionId: seccionParam } = useParams();
  const [searchParams] = useSearchParams();
  const seccionId = seccionParam || searchParams.get('seccionId');
  const nextPath = searchParams.get('next') || (seccionId ? `/ejercicios/${seccionId}` : '/dashboard');

  const [indexActual, setIndexActual] = useState(0);
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    if (!seccionId) {
      setError('Falta la sección del desafío. Volvé al dashboard y elegí un módulo.');
      setCargando(false);
      return undefined;
    }

    setCargando(true);
    api
      .get(`/secciones/${seccionId}/lecciones`)
      .then((res) => {
        if (!activo) return;
        const rows = (res.data || []).map((l) => ({
          id: l.id,
          titulo: l.titulo,
          url: l.videoUrl,
        }));
        setVideos(rows);
        setIndexActual(0);
        setError(
          rows.length
            ? null
            : 'Pronto vas a encontrar contenido acá. Mientras tanto, podés seguir con otros desafíos.',
        );
      })
      .catch((err) => {
        if (!activo) return;
        console.error(err);
        setError('No se pudieron cargar los videos de la lección.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [seccionId]);

  if (cargando) {
    return <LoadingSpinner message="Cargando video..." />;
  }

  if (error || !videos.length) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
        <div>
          <p style={{ color: '#dc2626' }}>{error || 'Sin videos'}</p>
          <button
            type="button"
            onClick={() => navigate(nextPath)}
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem' }}
          >
            Ir a los ejercicios
          </button>
        </div>
      </div>
    );
  }

  // Solo el video de este nivel (orden 1 o el primero)
  const videoActual = videos[Math.min(indexActual, videos.length - 1)];

  const manejarAtras = () => {
    navigate('/dashboard');
  };

  const manejarContinuar = () => {
    // Un nivel = un video → a ejercicios de ese nivel
    navigate(nextPath);
  };

  return (
    <VideoPage
      title={videoActual.titulo}
      videoUrl={videoActual.url}
      currentIndex={0}
      totalVideos={1}
      onBack={manejarAtras}
      onContinue={manejarContinuar}
    />
  );
}

export default Desafios;
