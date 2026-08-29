import { useEffect, useState } from 'react';
import VideoPage from '../components/layouts/VideoPage/VideoPage';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DEFAULT_VIDEOS_BY_SECTION = {
  1: {
    id: 1,
    titulo: "Estrategias de Suma y Resta: Presupuesto y Compras",
    url: "https://www.youtube-nocookie.com/embed/5a2d6_6eY8k",
  },
  2: {
    id: 2,
    titulo: "Cálculo Rápido de Descuentos y Porcentajes (20%, 50%, 15%)",
    url: "https://www.youtube-nocookie.com/embed/ETvdnGFza3E",
  },
  3: {
    id: 3,
    titulo: "División Práctica de Cuentas y Propinas",
    url: "https://www.youtube-nocookie.com/embed/jZ_yZ5j_7hY",
  },
  4: {
    id: 4,
    titulo: "Análisis Financiero: Cuotas fijas vs Pago al Contado",
    url: "https://www.youtube-nocookie.com/embed/6i1aGkEaI6A",
  },
  5: {
    id: 5,
    titulo: "Regla de Tres y Proporciones en la Cocina y la Vida Diaria",
    url: "https://www.youtube-nocookie.com/embed/7V9r0W8X2qA",
  },
  6: {
    id: 6,
    titulo: "Gran Desafío Maestro: Estrategias de Agilidad Numérica",
    url: "https://www.youtube-nocookie.com/embed/ETvdnGFza3E",
  }
};

function Desafios() {
  const navigate = useNavigate();
  const { seccionId: seccionParam } = useParams();
  const [searchParams] = useSearchParams();
  const seccionId = Number(seccionParam || searchParams.get('seccionId')) || 2;
  const nextPath = searchParams.get('next') || `/ejercicios/${seccionId}`;

  const [indexActual, setIndexActual] = useState(0);
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    const defaultVideo = DEFAULT_VIDEOS_BY_SECTION[seccionId] || DEFAULT_VIDEOS_BY_SECTION[2];

    api
      .get(`/secciones/${seccionId}/lecciones`)
      .then((res) => {
        if (!activo) return;
        const rows = (res.data || [])
          .filter((l) => l.videoUrl)
          .map((l) => ({
            id: l.id,
            titulo: l.titulo,
            url: l.videoUrl,
          }));

        setVideos(rows.length > 0 ? rows : [defaultVideo]);
        setIndexActual(0);
      })
      .catch((err) => {
        if (!activo) return;
        console.warn("Cargando video explicativo pedagógico:", err.message);
        setVideos([defaultVideo]);
        setIndexActual(0);
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
