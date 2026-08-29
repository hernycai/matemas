import type { MascotCharacterProps } from '../../types';
import { PlusMascot } from '../shared/PlusMascot';
import './suma.animations.css';

export function SumaMascot(props: MascotCharacterProps) {
  return <PlusMascot {...props} filterPrefix="suma" ariaName="Suma, mascota de suma" />;
}
