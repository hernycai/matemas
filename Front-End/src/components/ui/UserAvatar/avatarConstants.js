import fotoPerfilDefault from '../../../assets/Foto_perfil.png';

// Avatares clásicos
export const AVATARES_CLASICOS = [
  { id: 'default', label: 'Foto de Perfil Clásica', src: fotoPerfilDefault },
];

// Avatares de Animales Carismáticos
export const ANIMAL_AVATARS = [
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

export const MARCOS_DISPONIBLES = [
  { id: 'gold', label: 'Dorado Clásico', borderStyle: '4px solid #F59E0B', shadow: '0 0 14px rgba(245, 158, 11, 0.45)', color: '#F59E0B', shadowColor: 'rgba(245, 158, 11, 0.45)' },
  { id: 'mate-blue', label: 'Azul Mate+', borderStyle: '4px solid #0A3D91', shadow: '0 0 14px rgba(10, 61, 145, 0.45)', color: '#0A3D91', shadowColor: 'rgba(10, 61, 145, 0.45)' },
  { id: 'emerald', label: 'Esmeralda Ahorro', borderStyle: '4px solid #10B981', shadow: '0 0 14px rgba(16, 185, 129, 0.45)', color: '#10B981', shadowColor: 'rgba(16, 185, 129, 0.45)' },
  { id: 'fire', label: 'Fuego de Racha', borderStyle: '4px solid #F97316', shadow: '0 0 14px rgba(249, 115, 22, 0.45)', color: '#F97316', shadowColor: 'rgba(249, 115, 22, 0.45)' },
  { id: 'purple', label: 'Neón Púrpura', borderStyle: '4px solid #8B5CF6', shadow: '0 0 14px rgba(139, 92, 246, 0.45)', color: '#8B5CF6', shadowColor: 'rgba(139, 92, 246, 0.45)' },
  { id: 'silver', label: 'Platino Pro', borderStyle: '4px solid #94A3B8', shadow: '0 0 14px rgba(148, 163, 184, 0.45)', color: '#94A3B8', shadowColor: 'rgba(148, 163, 184, 0.45)' },
];

export function getAnimalAvatar(avatarId) {
  return ANIMAL_AVATARS.find(a => a.id === avatarId) || null;
}

export function getMarco(marcoId) {
  return MARCOS_DISPONIBLES.find(m => m.id === marcoId) || MARCOS_DISPONIBLES[0];
}
