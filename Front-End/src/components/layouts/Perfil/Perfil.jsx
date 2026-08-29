import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Desafios/headerDash/HeaderDash'; 
import fondoCuadrille from '../../../assets/fondo_consejo.png';
import fotoPerfilDefault from '../../../assets/Foto_perfil.png'; 
import iconInventario from '../../../assets/icono_inventario.png';
import iconAvatar from '../../../assets/icono_avatar.png';
import iconMarcos from '../../../assets/icono_marcos.png';
import iconTitulos from '../../../assets/icono_titulos.png';
import iconMascotas from '../../../assets/icono_mascota.png';
import { useAuth } from '../../../context/AuthContext';
import { useMascotContext } from '../../../mascotas/core/MascotProvider';
import { MascotCharacter } from '../../../mascotas/components/MascotCharacter';
import { FaCheck, FaCoins, FaFire, FaTrophy, FaStar, FaUserEdit, FaCheckCircle, FaDice, FaMapMarkerAlt, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../config/api';

import './Perfil.css';

const PROVINCIAS_ARGENTINAS = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
  "Otra provincia / exterior"
];

// Avatares clásicos
const AVATARES_CLASICOS = [
  { id: 'default', label: 'Foto de Perfil Clásica', src: fotoPerfilDefault },
];

// Avatares de Animales Carismáticos
const ANIMAL_AVATARS = [
  { id: 'animal-zorro', label: 'Zorro Ágil', icon: '🦊', bg: '#FED7AA', desc: 'Rápido en cálculo mental cotidiano' },
  { id: 'animal-buho', label: 'Búho Sabio', icon: '🦉', bg: '#DDD6FE', desc: 'Estratega del ahorro y presupuestos' },
  { id: 'animal-leon', label: 'León Valiente', icon: '🦁', bg: '#FEF08A', desc: 'Líder en decisiones de finanzas' },
  { id: 'animal-panda', label: 'Panda Calmo', icon: '🐼', bg: '#E2E8F0', desc: 'Cálculo metódico, sereno y exacto' },
  { id: 'animal-delfin', label: 'Delfín Astuto', icon: '🐬', bg: '#BAE6FD', desc: 'Agilidad numérica sin estrés' },
  { id: 'animal-koala', label: 'Koala Curioso', icon: '🐨', bg: '#D1D5DB', desc: 'Explorador de recetas y medidas' },
  { id: 'animal-tigre', label: 'Tigre Enfocado', icon: '🐯', bg: '#FDE68A', desc: 'Precisión en compras y precios unitarios' },
  { id: 'animal-perro', label: 'Perro Fiel', icon: '🐶', bg: '#FFEDD5', desc: 'Compañero constante de racha diaria' },
  { id: 'animal-gato', label: 'Gato Audaz', icon: '🐱', bg: '#FBCFE8', desc: 'Cazador de rebajas y ofertas relámpago' },
  { id: 'animal-aguila', label: 'Águila Precisa', icon: '🦅', bg: '#E0E7FF', desc: 'Visión panorámica de gastos familiares' },
  { id: 'animal-lobo', label: 'Lobo Estratega', icon: '🐺', bg: '#CFFAFE', desc: 'Trabajo y reparto justo en equipo' },
  { id: 'animal-unicornio', label: 'Unicornio Mágico', icon: '🦄', bg: '#F3E8FF', desc: 'Maestro de proporciones y regla de tres' },
];

const MARCOS_DISPONIBLES = [
  { id: 'gold', label: 'Dorado Clásico', borderStyle: '4px solid #F59E0B', shadow: '0 0 14px rgba(245, 158, 11, 0.45)', color: '#F59E0B' },
  { id: 'mate-blue', label: 'Azul Mate+', borderStyle: '4px solid #0A3D91', shadow: '0 0 14px rgba(10, 61, 145, 0.45)', color: '#0A3D91' },
  { id: 'emerald', label: 'Esmeralda Ahorro', borderStyle: '4px solid #10B981', shadow: '0 0 14px rgba(16, 185, 129, 0.45)', color: '#10B981' },
  { id: 'fire', label: 'Fuego de Racha', borderStyle: '4px solid #F97316', shadow: '0 0 14px rgba(249, 115, 22, 0.45)', color: '#F97316' },
  { id: 'purple', label: 'Neón Púrpura', borderStyle: '4px solid #8B5CF6', shadow: '0 0 14px rgba(139, 92, 246, 0.45)', color: '#8B5CF6' },
  { id: 'silver', label: 'Platino Pro', borderStyle: '4px solid #94A3B8', shadow: '0 0 14px rgba(148, 163, 184, 0.45)', color: '#94A3B8' },
];

const TITULOS_DISPONIBLES = [
  { id: 'As de la Suma', label: 'As de la Suma', desc: 'Dominio de sumas y presupuestos cotidianos' },
  { id: 'Especialista en Descuentos', label: 'Especialista en Descuentos', desc: 'Cálculo veloz de rebajas y ofertas' },
  { id: 'Maestro del Presupuesto', label: 'Maestro del Presupuesto', desc: 'Organización eficiente de ingresos y gastos' },
  { id: 'Calculista Cotidiano', label: 'Calculista Cotidiano', desc: 'Autonomía matemática para todas las decisiones' },
  { id: 'Autónomo Financiero', label: 'Autónomo Financiero', desc: 'Resolución de compras y cuotas con confianza' },
  { id: 'Rey de la Regla de 3', label: 'Rey de la Regla de 3', desc: 'Equivalencias y recetas sin errores' },
];

// Mascotas oficiales con descripción de fantasía y su función matemática
const MASCOTAS_DISPONIBLES = [
  {
    id: 'suma',
    nombre: 'Suma (+)',
    tituloFantasia: 'El Guardián del Tesoro y la Abundancia',
    descripcionFantasia: 'Nacido del corazón del sol matemático, Suma canaliza la energía de la unión. Reúne cada moneda, junta esfuerzos colectivos y hace crecer los ahorros y presupuestos familiares con optimismo inquebrantable.',
    colorTema: '#F97316',
    fondoTema: '#FFF7ED',
    bordeTema: '#FDBA74',
  },
  {
    id: 'resta',
    nombre: 'Resta (−)',
    tituloFantasia: 'El Cazador de Sombras y Descuentos',
    descripcionFantasia: 'Con una visión afilada como el hielo, Resta vigila los precios inflados y los sobrecargos ocultos. Su espada mágica recorta los gastos innecesarios, calcula rebajas al instante y rescata el valor del dinero ahorrado.',
    colorTema: '#0284C7',
    fondoTema: '#F0F9FF',
    bordeTema: '#7DD3FC',
  },
  {
    id: 'multi',
    nombre: 'Multi (×)',
    tituloFantasia: 'La Alquimista de los Sueños y el Crecimiento',
    descripcionFantasia: 'Maestra de la geometría mágica y la aceleración temporal, Multi toma una pequeña semilla y la expande en grandes cosechas. Multiplica porciones de cocina, planifica cuotas claras y proyecta ganancias a futuro.',
    colorTema: '#CA8A04',
    fondoTema: '#FEFCE8',
    bordeTema: '#FDE047',
  },
  {
    id: 'division',
    nombre: 'Divi (÷)',
    tituloFantasia: 'El Sabio de la Balanza y la Justicia',
    descripcionFantasia: 'Custodio del equilibrio ancestral, Divi calcula con precisión milimétrica cada reparto. En las mesas de restaurantes y presupuestos grupales, asegura que reine la armonía y nadie pague de más ni de menos.',
    colorTema: '#16A34A',
    fondoTema: '#F0FDF4',
    bordeTema: '#86EFAC',
  },
];

const LOGROS = [
  { id: 1, titulo: 'Primer Paso', desc: 'Completaste tu primer módulo de práctica.', icon: '🎯', completado: true },
  { id: 2, titulo: 'Racha Imparable', desc: 'Mantuviste 7 días consecutivos de práctica.', icon: '🔥', completado: true },
  { id: 3, titulo: 'Ahorrista Estrella', desc: 'Resolviste 5 ejercicios de descuentos.', icon: '🏷️', completado: true },
  { id: 4, titulo: 'Finanzas Claras', desc: 'Analizaste cuotas vs contado con éxito.', icon: '💳', completado: true },
  { id: 5, titulo: 'Chef de Proporciones', desc: 'Ajustaste una receta con regla de tres.', icon: '🍳', completado: false },
  { id: 6, titulo: 'Cálculo Relámpago', desc: 'Completaste un desafío mixto sin fallos.', icon: '⚡', completado: false },
];

function Perfil() {
  const navigate = useNavigate();
  const { profile, updateProfile, logout } = useAuth();
  const { setMascot } = useMascotContext();
  const [activeTab, setActiveTab] = useState('datos');
  const [showHeader, setShowHeader] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [textoConfirmacion, setTextoConfirmacion] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || 'María Gómez',
    email: profile?.email || 'usuario@matemas.com',
    edad: profile?.edad || '38',
    provincia: profile?.provincia || 'Córdoba',
    ciudad: profile?.ciudad || 'Córdoba Capital',
    desafio: profile?.desafio || 'mejorar_calculo_diario',
    sentimiento: profile?.sentimiento || 'motivado',
    avatar: profile?.avatar || 'animal-buho',
    marco: profile?.marco || 'emerald',
    titulo: profile?.titulo || 'Especialista en Descuentos',
    mascota: profile?.mascota || 'suma',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || 'María Gómez',
        email: profile.email || 'usuario@matemas.com',
        edad: profile.edad || '38',
        provincia: profile.provincia || 'Córdoba',
        ciudad: profile.ciudad || 'Córdoba Capital',
        desafio: profile.desafio || 'mejorar_calculo_diario',
        sentimiento: profile.sentimiento || 'motivado',
        avatar: profile.avatar || 'animal-buho',
        marco: profile.marco || 'emerald',
        titulo: profile.titulo || 'Especialista en Descuentos',
        mascota: profile.mascota || 'suma',
      });
    }
  }, [profile]);

  const opcionesMenu = [
    { id: 'datos', label: 'Datos Personales', iconImg: iconAvatar },
    { id: 'avatar', label: 'Elegir Avatar', iconImg: iconAvatar },
    { id: 'marcos', label: 'Marcos de Perfil', iconImg: iconMarcos },
    { id: 'titulos', label: 'Títulos de Honor', iconImg: iconTitulos },
    { id: 'mascota', label: 'Mascota & Tutor', iconImg: iconMascotas },
    { id: 'inventario', label: 'Inventario & Logros', iconImg: iconInventario },
    { id: 'eliminar', label: 'Eliminar Perfil', iconImg: iconAvatar },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setGuardadoExitoso(false);
  };

  const handleElegirAvatarAleatorio = () => {
    const randomIndex = Math.floor(Math.random() * ANIMAL_AVATARS.length);
    const randomAnimal = ANIMAL_AVATARS[randomIndex];
    handleInputChange('avatar', randomAnimal.id);
  };

  const handleGuardarCambios = async () => {
    setGuardando(true);
    try {
      if (updateProfile) {
        await updateProfile(formData);
      }
      if (formData.mascota && setMascot) {
        setMascot(formData.mascota);
      }
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 4000);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR') {
      alert('Por favor escribí la palabra ELIMINAR para confirmar la eliminación de tu cuenta.');
      return;
    }

    setEliminando(true);
    try {
      await api.delete('/usuarios/eliminar', {
        data: { confirmacion: 'ELIMINAR' },
      });
      setShowModalEliminar(false);
      await logout?.();
      window.location.href = '/';
      alert('Tu perfil y todos tus datos fueron eliminados permanentemente.');
    } catch (err) {
      console.error('Error al eliminar perfil:', err);
      alert(err.response?.data?.error || err.message || 'No se pudo eliminar el perfil.');
    } finally {
      setEliminando(false);
    }
  };

  const marcoSeleccionado = MARCOS_DISPONIBLES.find(m => m.id === formData.marco) || MARCOS_DISPONIBLES[0];

  const renderAvatarGraphic = (avatarId, size = 96) => {
    const animal = ANIMAL_AVATARS.find(a => a.id === avatarId);
    if (animal) {
      return (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: animal.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size * 0.55}px`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        }}>
          {animal.icon}
        </div>
      );
    }
    const clasico = AVATARES_CLASICOS.find(a => a.id === avatarId) || AVATARES_CLASICOS[0];
    return (
      <img 
        src={clasico.src} 
        alt="Foto de perfil" 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  };

  return (
    <div className="perfil-page-container">
      <Header showHeader={showHeader} setShowHeader={setShowHeader} />

      <div 
        className="perfil-main-content"
        style={{ backgroundImage: `url(${fondoCuadrille})` }}
      >
        <div className="perfil-layout-grid">
          
          {/* BARRA LATERAL (SIDEBAR) */}
          <aside className="perfil-sidebar">
            <h2 className="sidebar-title">Editar perfil</h2>
            <nav className="sidebar-menu">
              {opcionesMenu.map((opcion) => (
                <button
                  key={opcion.id}
                  type="button"
                  className={`sidebar-link ${activeTab === opcion.id ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(opcion.id)}
                >
                  <div className="sidebar-icon-wrapper">
                    <img src={opcion.iconImg} alt={opcion.label} className="sidebar-icon-img" />
                  </div>
                  <span className="sidebar-label-text">{opcion.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* DETALLES DE LA DERECHA */}
          <main className="perfil-details-zone">
                             
            {/* TARJETA DE USUARIO CON PREVIEW EN VIVO */}
            <section className="perfil-user-card">
              <div
                className="perfil-avatar-wrapper"
                style={{
                  border: marcoSeleccionado.borderStyle,
                  boxShadow: marcoSeleccionado.shadow,
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                }}
              >
                {renderAvatarGraphic(formData.avatar, 96)}
              </div>
              
              <div className="perfil-user-meta">
                <h2 className="perfil-username">{formData.nombre || 'Usuario'}</h2>
                <div className="perfil-badge-tag" style={{ backgroundColor: marcoSeleccionado.color }}>
                  {formData.titulo}
                </div>
                <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.85rem', color: '#334155', fontWeight: 600, flexWrap: 'wrap' }}>
                  {formData.provincia && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaMapMarkerAlt color="#0A3D91" /> {formData.ciudad ? `${formData.ciudad}, ` : ''}{formData.provincia}
                    </span>
                  )}
                  <span>🔥 {profile?.racha ?? 7} días de racha</span>
                  <span>⭐ {profile?.puntos ?? 450} XP</span>
                  <span>🪙 {profile?.monedas ?? 30} Monedas</span>
                </div>
              </div>
            </section>

            {/* MENSAJE DE ÉXITO */}
            {guardadoExitoso && (
              <div style={{
                backgroundColor: '#DCFCE7',
                border: '2px solid #16A34A',
                color: '#166534',
                padding: '12px 18px',
                borderRadius: '16px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
              }}>
                <FaCheckCircle size={20} />
                <span>¡Cambios guardados con éxito en tu perfil y sincronizados con toda la aplicación!</span>
              </div>
            )}

            {/* TARJETA BLANCA DE CONTENIDO */}
            <section className="perfil-content-card">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                <h2 className="content-card-title" style={{ margin: 0 }}>
                  {opcionesMenu.find(o => o.id === activeTab)?.label || 'Sección'}
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Personalización para adultos
                </span>
              </div>

              {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
              <div className="perfil-tab-body" style={{ minHeight: '260px' }}>
                
                {/* 1. DATOS PERSONALES (INCLUYE PROVINCIA Y CIUDAD) */}
                {activeTab === 'datos' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Nombre Completo o Apodo:
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ej. María Gómez"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Correo Electrónico:
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="usuario@ejemplo.com"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '1rem',
                          color: '#64748B',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Provincia:
                      </label>
                      <select
                        value={formData.provincia}
                        onChange={(e) => handleInputChange('provincia', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="">Seleccioná tu provincia...</option>
                        {PROVINCIAS_ARGENTINAS.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Ciudad / Localidad:
                      </label>
                      <input
                        type="text"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        placeholder="Ej. Córdoba Capital, Rosario, etc."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Edad:
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="120"
                        value={formData.edad}
                        onChange={(e) => handleInputChange('edad', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                        Objetivo Principal:
                      </label>
                      <select
                        value={formData.desafio}
                        onChange={(e) => handleInputChange('desafio', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #CBD5E1',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="mejorar_calculo_diario">Mejorar cálculo cotidiano (descuentos, compras)</option>
                        <option value="finanzas_hogar">Gestionar presupuesto y finanzas familiares</option>
                        <option value="agilidad_mental">Mantener mi agilidad mental activa</option>
                        <option value="ayuda_hijos">Poder ayudar a mis hijos/nietos en la escuela</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. SELECCIÓN DE AVATAR (ANIMALES Y ALEATORIO) */}
                {activeTab === 'avatar' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                      <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                        Elegí tu avatar de animal o generá uno al azar:
                      </p>
                      <button
                        type="button"
                        onClick={handleElegirAvatarAleatorio}
                        style={{
                          backgroundColor: '#FFDB54',
                          border: 'none',
                          color: '#0A3D91',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <FaDice size={16} />
                        <span>Elegir Animal al Azar</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                      {/* Avatares de Animales */}
                      {ANIMAL_AVATARS.map((animal) => {
                        const seleccionado = formData.avatar === animal.id;
                        return (
                          <div
                            key={animal.id}
                            onClick={() => handleInputChange('avatar', animal.id)}
                            style={{
                              border: seleccionado ? '3px solid #0A3D91' : '2px solid #E2E8F0',
                              backgroundColor: seleccionado ? '#EFF6FF' : '#FFFFFF',
                              borderRadius: '16px',
                              padding: '12px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: seleccionado ? '0 4px 12px rgba(10,61,145,0.15)' : 'none',
                            }}
                          >
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '50%',
                              backgroundColor: animal.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '30px',
                              margin: '0 auto 8px auto',
                            }}>
                              {animal.icon}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: seleccionado ? '#0A3D91' : '#334155' }}>
                              {animal.label}
                            </div>
                            <small style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '2px', lineHeight: 1.2 }}>
                              {animal.desc}
                            </small>
                            {seleccionado && (
                              <div style={{ marginTop: '4px', color: '#0A3D91', fontSize: '0.75rem', fontWeight: 800 }}>
                                <FaCheck /> Activo
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Avatar clásico */}
                      {AVATARES_CLASICOS.map((av) => {
                        const seleccionado = formData.avatar === av.id;
                        return (
                          <div
                            key={av.id}
                            onClick={() => handleInputChange('avatar', av.id)}
                            style={{
                              border: seleccionado ? '3px solid #0A3D91' : '2px solid #E2E8F0',
                              backgroundColor: seleccionado ? '#EFF6FF' : '#FFFFFF',
                              borderRadius: '16px',
                              padding: '12px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <img
                              src={av.src}
                              alt={av.label}
                              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px auto', display: 'block' }}
                            />
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: seleccionado ? '#0A3D91' : '#334155' }}>
                              {av.label}
                            </div>
                            {seleccionado && (
                              <div style={{ marginTop: '4px', color: '#0A3D91', fontSize: '0.75rem', fontWeight: 800 }}>
                                <FaCheck /> Activo
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. MARCOS DE PERFIL */}
                {activeTab === 'marcos' && (
                  <div>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem' }}>
                      Seleccioná el marco decorativo que resalta tu avatar:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                      {MARCOS_DISPONIBLES.map((m) => {
                        const seleccionado = formData.marco === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleInputChange('marco', m.id)}
                            style={{
                              border: seleccionado ? `3px solid ${m.color}` : '2px solid #E2E8F0',
                              backgroundColor: seleccionado ? '#F8FAFC' : '#FFFFFF',
                              borderRadius: '16px',
                              padding: '14px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              boxShadow: seleccionado ? m.shadow : 'none',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                border: m.borderStyle,
                                margin: '0 auto 10px auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#FFFFFF',
                              }}
                            >
                              <span style={{ fontSize: '1.2rem' }}>✨</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
                              {m.label}
                            </div>
                            {seleccionado && (
                              <div style={{ marginTop: '4px', color: m.color, fontSize: '0.75rem', fontWeight: 800 }}>
                                <FaCheck /> Equipado
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. TÍTULOS DE HONOR */}
                {activeTab === 'titulos' && (
                  <div>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem' }}>
                      Elegí el título de honor que se muestra debajo de tu nombre:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {TITULOS_DISPONIBLES.map((t) => {
                        const seleccionado = formData.titulo === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => handleInputChange('titulo', t.id)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              border: seleccionado ? '2px solid #0A3D91' : '1px solid #E2E8F0',
                              backgroundColor: seleccionado ? '#EFF6FF' : '#FFFFFF',
                              padding: '12px 18px',
                              borderRadius: '14px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: seleccionado ? '#0A3D91' : '#1E293B', fontSize: '1rem' }}>
                                {t.label}
                              </div>
                              <small style={{ color: '#64748B', fontWeight: 500 }}>
                                {t.desc}
                              </small>
                            </div>
                            {seleccionado ? (
                              <span style={{ backgroundColor: '#0A3D91', color: '#FFFFFF', padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
                                Seleccionado
                              </span>
                            ) : (
                              <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>
                                Elegir
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. MASCOTA & TUTOR CON IMÁGENES EXACTAS Y DESCRIPCIÓN DE FANTASÍA */}
                {activeTab === 'mascota' && (
                  <div>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                      Elegí a tu tutor guardián para acompañarte en los cálculos, presupuestos y compras del día a día:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      {MASCOTAS_DISPONIBLES.map((m) => {
                        const seleccionado = formData.mascota === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleInputChange('mascota', m.id)}
                            style={{
                              border: seleccionado ? `3px solid ${m.colorTema}` : `1px solid ${m.bordeTema}`,
                              backgroundColor: m.fondoTema,
                              borderRadius: '20px',
                              padding: '1.25rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              boxShadow: seleccionado ? `0 8px 20px ${m.colorTema}33` : '0 2px 6px rgba(0,0,0,0.04)',
                              transition: 'all 0.25s ease',
                              transform: seleccionado ? 'scale(1.02)' : 'scale(1)',
                            }}
                          >
                            <div>
                              {/* Personaje animado oficial exacto */}
                              <div style={{
                                width: '100%',
                                height: '90px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '10px',
                              }}>
                                <MascotCharacter mascotId={m.id} size={85} state={seleccionado ? "idle" : "thinking"} />
                              </div>

                              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>
                                  {m.nombre}
                                </div>
                                <div style={{
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  color: m.colorTema,
                                  marginTop: '2px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  ✨ {m.tituloFantasia}
                                </div>
                              </div>

                              <p style={{
                                fontSize: '0.86rem',
                                color: '#334155',
                                lineHeight: 1.45,
                                margin: '0 0 12px 0',
                                textAlign: 'center',
                                fontStyle: 'italic',
                              }}>
                                "{m.descripcionFantasia}"
                              </p>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                              {seleccionado ? (
                                <div style={{
                                  backgroundColor: m.colorTema,
                                  color: '#FFFFFF',
                                  padding: '6px 14px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: `0 2px 8px ${m.colorTema}66`,
                                }}>
                                  <FaCheck /> Tutor Activo
                                </div>
                              ) : (
                                <div style={{
                                  backgroundColor: 'rgba(255,255,255,0.8)',
                                  border: `1px solid ${m.bordeTema}`,
                                  color: m.colorTema,
                                  padding: '6px 14px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  display: 'inline-block',
                                }}>
                                  Elegir a {m.nombre}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. INVENTARIO & LOGROS */}
                {activeTab === 'inventario' && (
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}>
                      <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '14px', textAlign: 'center', border: '1px solid #FDE68A' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309' }}>🪙 {profile?.monedas ?? 30}</div>
                        <small style={{ fontWeight: 700, color: '#92400E' }}>Monedas</small>
                      </div>
                      <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '14px', textAlign: 'center', border: '1px solid #BFDBFE' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1D4ED8' }}>⭐ {profile?.puntos ?? 450}</div>
                        <small style={{ fontWeight: 700, color: '#1E40AF' }}>Puntos XP</small>
                      </div>
                      <div style={{ backgroundColor: '#FFEDD5', padding: '12px', borderRadius: '14px', textAlign: 'center', border: '1px solid #FED7AA' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C2410C' }}>🔥 {profile?.racha ?? 7} días</div>
                        <small style={{ fontWeight: 700, color: '#9A3412' }}>Racha Actual</small>
                      </div>
                      <div style={{ backgroundColor: '#DCFCE7', padding: '12px', borderRadius: '14px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D' }}>🏆 4</div>
                        <small style={{ fontWeight: 700, color: '#166534' }}>Trofeos Ganados</small>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>
                      Medallas de Aprendizaje:
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      {LOGROS.map((logro) => (
                        <div
                          key={logro.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: logro.completado ? '#FFFFFF' : '#F1F5F9',
                            border: logro.completado ? '1px solid #CBD5E1' : '1px dashed #CBD5E1',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            opacity: logro.completado ? 1 : 0.6,
                          }}
                        >
                          <span style={{ fontSize: '1.6rem' }}>{logro.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{logro.titulo}</div>
                            <small style={{ color: '#64748B', fontSize: '0.75rem' }}>{logro.desc}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. ZONA DE PELIGRO: ELIMINAR PERFIL */}
                {activeTab === 'eliminar' && (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '2px solid #F87171',
                    borderRadius: '16px',
                    padding: '24px',
                    color: '#991B1B',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <FaExclamationTriangle size={26} color="#DC2626" />
                      <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', color: '#991B1B' }}>
                        Zona de Peligro: Eliminar Perfil y Cuenta
                      </h3>
                    </div>

                    <p style={{ fontSize: '0.95rem', color: '#7F1D1D', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Esta acción es <strong>definitiva e irreversible</strong>. Al eliminar tu perfil:
                    </p>

                    <ul style={{ fontSize: '0.9rem', color: '#7F1D1D', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      <li>Se borrarán todos tus datos personales, apodo, provincia y avatar.</li>
                      <li>Perderás todos tus puntos XP, monedas acumuladas y racha de días.</li>
                      <li>Se eliminará todo tu historial de ejercicios resueltos y módulos aprobados.</li>
                      <li>Tu usuario será removido del ranking general de la plataforma.</li>
                    </ul>

                    <button
                      type="button"
                      onClick={() => {
                        setTextoConfirmacion('');
                        setShowModalEliminar(true);
                      }}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FaTrashAlt />
                      <span>Eliminar Mi Perfil Definitivamente</span>
                    </button>
                  </div>
                )}

              </div>

              {/* BOTÓN GUARDAR CAMBIOS (Oculto en tab eliminar) */}
              {activeTab !== 'eliminar' && (
                <button
                  type="button"
                  className="save-profile-btn"
                  onClick={handleGuardarCambios}
                  disabled={guardando}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: guardando ? 0.7 : 1,
                    marginTop: '1.5rem',
                  }}
                >
                  <FaUserEdit size={18} />
                  <span>{guardando ? 'Guardando...' : 'Guardar Cambios del Perfil'}</span>
                </button>
              )}

            </section>

          </main>

        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR PERFIL */}
      {showModalEliminar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#FEE2E2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}>
              <FaTrashAlt size={26} color="#DC2626" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>
              ¿Estás seguro de eliminar tu perfil?
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              Para confirmar que realmente deseas eliminar permanentemente tu cuenta y perder tu progreso, por favor escribe la palabra <strong style={{ color: '#DC2626' }}>ELIMINAR</strong> a continuación:
            </p>

            <input
              type="text"
              value={textoConfirmacion}
              onChange={(e) => setTextoConfirmacion(e.target.value)}
              placeholder="Escribe ELIMINAR"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #CBD5E1',
                fontSize: '1rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowModalEliminar(false)}
                disabled={eliminando}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarEliminacion}
                disabled={eliminando || textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR'}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: eliminando || textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR' ? 'not-allowed' : 'pointer',
                  opacity: eliminando || textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR' ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                }}
              >
                {eliminando ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;