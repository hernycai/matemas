
import { multiConfig } from './mascotas/multi/multi.config';
import { sumaConfig } from './mascotas/suma/suma.config';
import { restaConfig } from './mascotas/resta/resta.config';
import { divisionConfig } from './mascotas/division/division.config';

/** Registro central de las 4 mascotas */
export const MASCOT_REGISTRY = {
  multi: multiConfig,
  suma: sumaConfig,
  resta: restaConfig,
  division: divisionConfig,
};

export function getMascotConfig(id) {
  return MASCOT_REGISTRY[id];
}

export function getRandomDialog(id, moment) {
  const config = MASCOT_REGISTRY[id];
  if (!config?.dialogs) return null;
  const options = config.dialogs[moment];
  if (!options || options.length === 0) return null;
  return options[Math.floor(Math.random() * options.length)];
}

export const MASCOT_LIST = ['multi', 'suma', 'resta', 'division'];

export const MASCOT_LABELS = {
  multi: 'Multi (×)',
  suma: 'Suma (+)',
  resta: 'Resta (−)',
  division: 'Divi (÷)',
};
