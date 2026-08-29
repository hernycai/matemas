

// Core
export { MascotProvider, useMascotContext } from './core/MascotProvider';
export { useMascot } from './core/useMascot';
export { processMathQuery, formatMoney, formatNum, safeEvaluateMath } from './core/BotMathEngine';

// Componentes
export { MascotWidget } from './components/MascotWidget';
export { MascotCharacter } from './components/MascotCharacter';
export { SpeechBubble } from './components/SpeechBubble';
export { MascotChatModal } from './components/MascotChatModal';

// Mascotas individuales
export { MultiMascot } from './mascotas/multi/MultiMascot';
export { SumaMascot } from './mascotas/suma/SumaMascot';
export { RestaMascot } from './mascotas/resta/RestaMascot';
export { DivisionMascot } from './mascotas/division/DivisionMascot';

// Configs
export { multiConfig } from './mascotas/multi/multi.config';
export { sumaConfig } from './mascotas/suma/suma.config';
export { restaConfig } from './mascotas/resta/resta.config';
export { divisionConfig } from './mascotas/division/division.config';

// Registry
export {
  MASCOT_REGISTRY,
  MASCOT_LIST,
  MASCOT_LABELS,
  getMascotConfig,
  getRandomDialog,
} from './registry';

