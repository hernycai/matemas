import { MultiMascot } from '../mascotas/multi/MultiMascot';
import { SumaMascot } from '../mascotas/suma/SumaMascot';
import { RestaMascot } from '../mascotas/resta/RestaMascot';
import { DivisionMascot } from '../mascotas/division/DivisionMascot';

const MASCOT_COMPONENTS = {
  multi: MultiMascot,
  suma: SumaMascot,
  resta: RestaMascot,
  division: DivisionMascot,
};

export function MascotCharacter({ mascotId, state, size, className }) {
  // Si no hay mascota seleccionada, mostrar un placeholder
  if (!mascotId) {
    return null
  }

  const Component = MASCOT_COMPONENTS[mascotId];

  // Si el ID no existe en el registro, mostrar error o placeholder
  if (!Component) {
    console.warn(`Mascota con ID "${mascotId}" no encontrada`);
    return (
      <div
        className={className}
        style={{
          width: size || 100,
          height: size || 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffebee',
          borderRadius: '50%',
          color: '#c62828',
          fontSize: '12px',
          textAlign: 'center'
        }}
      >
        Mascota<br />no disponible
      </div>
    );
  }

  return <Component state={state} size={size} className={className} />;
}