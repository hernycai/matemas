import { useAuth } from '../../../context/AuthContext';
import { ANIMAL_AVATARS, AVATARES_CLASICOS, MARCOS_DISPONIBLES } from './avatarConstants';
import fotoPerfilDefault from '../../../assets/Foto_perfil.png';

export default function UserAvatar({
  avatar,
  marco,
  size = 40,
  showFrame = true,
  className = '',
  style = {},
  alt = 'Avatar de usuario'
}) {
  let authProfile = null;
  try {
    const auth = useAuth();
    authProfile = auth?.profile || null;
  } catch {
    // Auth context might not be available in isolated views
  }

  const resolvedAvatar = avatar || authProfile?.avatar || 'animal-buho';
  const resolvedMarco = marco || authProfile?.marco || 'gold';

  const animal = ANIMAL_AVATARS.find(a => a.id === resolvedAvatar);
  const marcoConfig = MARCOS_DISPONIBLES.find(m => m.id === resolvedMarco) || MARCOS_DISPONIBLES[0];

  const borderWidth = size <= 40 ? 2 : size <= 64 ? 3 : 4;
  const frameBorder = showFrame ? `${borderWidth}px solid ${marcoConfig.color}` : 'none';
  const frameShadow = showFrame ? `0 0 ${Math.max(4, size * 0.12)}px ${marcoConfig.shadowColor}` : 'none';

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: frameBorder,
    boxShadow: frameShadow,
    overflow: 'hidden',
    userSelect: 'none',
    boxSizing: 'border-box',
    ...style
  };

  if (animal) {
    return (
      <div
        className={`user-avatar-component ${className}`}
        style={{
          ...containerStyle,
          backgroundColor: animal.bg,
          fontSize: `${Math.round(size * 0.54)}px`,
        }}
        title={animal.label}
        aria-label={animal.label}
      >
        <span role="img" aria-label={animal.label} style={{ lineHeight: 1 }}>
          {animal.icon}
        </span>
      </div>
    );
  }

  // Si es URL o ruta de imagen
  const isImageSrc = typeof resolvedAvatar === 'string' && (
    resolvedAvatar.startsWith('http') ||
    resolvedAvatar.startsWith('/') ||
    resolvedAvatar.startsWith('data:') ||
    resolvedAvatar.includes('.')
  );

  let imgSrc = fotoPerfilDefault;
  if (isImageSrc) {
    imgSrc = resolvedAvatar;
  } else {
    const clasico = AVATARES_CLASICOS.find(a => a.id === resolvedAvatar);
    if (clasico) imgSrc = clasico.src;
  }

  return (
    <div
      className={`user-avatar-component ${className}`}
      style={containerStyle}
      title={alt}
    >
      <img
        src={imgSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
}
