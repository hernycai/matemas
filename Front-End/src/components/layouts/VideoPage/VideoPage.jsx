import React from 'react';
import HeaderMate from '../HeaderMate/HeaderMate';
import ButtonBack from '../../ui/ButtonBack/ButtonBack';
import ButtonContinue from '../../ui/ButtonContinue/ButtonContinue';
import './VideoPage.css';

function isCloudinaryOrFile(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('res.cloudinary.com') ||
    lower.includes('cloudinary.com') ||
    /\.(mp4|webm|ogg)(\?|$)/i.test(lower)
  );
}

function toYoutubeEmbed(url) {
  if (!url) return '';
  if (url.includes('youtube-nocookie.com/embed/') || url.includes('youtube.com/embed/')) {
    return url.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
  }
  try {
    const parsed = new URL(url);
    const id =
      parsed.searchParams.get('v') ||
      (parsed.pathname.startsWith('/embed/')
        ? parsed.pathname.split('/')[2]
        : parsed.hostname.includes('youtu.be')
          ? parsed.pathname.replace('/', '')
          : null);
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch {
    /* ignore */
  }
  return url;
}

function VideoPage({
  title,
  videoUrl,
  currentIndex,
  totalVideos,
  onBack,
  onContinue,
}) {
  const isLastVideo = currentIndex === totalVideos - 1;
  const useNativeVideo = isCloudinaryOrFile(videoUrl);
  const embedSrc = useNativeVideo ? null : toYoutubeEmbed(videoUrl);

  return (
    <div className="video-page-container">
      <HeaderMate />

      <main className="video-page-content">
        <div className="video-page-top-bar">
          <ButtonBack onClick={onBack} />
          <div className="video-page-title-container">
            <h1 className="video-page-title">{title}</h1>
          </div>
        </div>

        <div className="video-wrapper">
          {useNativeVideo ? (
            <video
              className="video-player"
              src={videoUrl}
              title={title || 'Video explicativo de Mate+'}
              controls
              playsInline
              preload="metadata"
            >
              Tu navegador no soporta video HTML5.
            </video>
          ) : (
            <iframe
              className="video-player"
              src={embedSrc}
              title={title || 'Video explicativo de Mate+'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>

        <div className="video-page-footer">
          <ButtonContinue
            onClick={onContinue}
            label={isLastVideo ? 'Ir a ejercicios' : 'Continuar'}
          />
        </div>
      </main>
    </div>
  );
}

export default VideoPage;
