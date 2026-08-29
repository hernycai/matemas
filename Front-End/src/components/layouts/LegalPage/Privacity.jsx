import React from 'react';
import './LegalText.css';

function Privacity() {
  return (
    <div className="legal-text-content">
      <h2>1. Introducción</h2>
      <p>
        En <strong>Mate+</strong> nos comprometemos a proteger la privacidad de nuestros usuarios y a garantizar un tratamiento responsable de la información recopilada. Esta Política de Privacidad explica qué datos obtenemos, cómo los utilizamos y qué medidas adoptamos para protegerlos.
      </p>

      <h2>2. Información que recopilamos</h2>
      <p>La aplicación podrá recopilar la siguiente información:</p>
      
      <h3>Datos personales</h3>
      <ul>
        <li>Nombre y apellido.</li>
        <li>Correo electrónico.</li>
        <li>Ciudad de residencia.</li>
        <li>Edad.</li>
      </ul>

      <h3>Datos de uso</h3>
      <ul>
        <li>Fecha y hora de registro.</li>
        <li>Inicio y cierre de sesión.</li>
        <li>Lecciones iniciadas y finalizadas.</li>
        <li>Respuestas correctas e incorrectas.</li>
        <li>Tiempo dedicado a cada actividad.</li>
        <li>Progreso del usuario.</li>
        <li>Logros, insignias y recompensas obtenidas.</li>
        <li>Estadísticas generales de uso de la aplicación.</li>
      </ul>

      <h2>3. Finalidad del tratamiento de los datos</h2>
      <p>La información recopilada será utilizada para:</p>
      <ul>
        <li>Crear y administrar la cuenta del usuario.</li>
        <li>Personalizar la experiencia de aprendizaje.</li>
        <li>Registrar el progreso en las actividades.</li>
        <li>Generar estadísticas e indicadores sobre el uso de la plataforma.</li>
        <li>Identificar oportunidades de mejora en los contenidos y funcionalidades.</li>
        <li>Elaborar informes con fines académicos y de análisis de datos.</li>
      </ul>

      <h2>4. Protección de la información</h2>
      <p>
        Se implementarán medidas razonables para proteger la información contra accesos no autorizados, alteraciones, pérdidas o divulgaciones indebidas. El acceso a los datos estará limitado únicamente a las personas responsables del proyecto.
      </p>

      <h2>5. Compartición de datos</h2>
      <p>
        La información recopilada no será vendida, alquilada ni cedida a terceros. Los datos únicamente podrán compartirse cuando exista una obligación legal o cuando sea necesario para el funcionamiento de los servicios utilizados por la aplicación.
      </p>

      <h2>6. Conservación de los datos</h2>
      <p>
        Los datos serán conservados únicamente durante el tiempo necesario para cumplir con los objetivos del proyecto y posteriormente podrán ser eliminados o anonimizados para fines de análisis estadístico.
      </p>

      <h2>7. Derechos del usuario</h2>
      <p>El usuario podrá solicitar, cuando corresponda:</p>
      <ul>
        <li>Acceder a la información registrada.</li>
        <li>Solicitar la corrección de datos inexactos.</li>
        <li>Solicitar la eliminación de sus datos personales.</li>
        <li>Revocar el consentimiento para el tratamiento de sus datos, sin afectar la licitud del tratamiento realizado con anterioridad.</li>
      </ul>

      <h2>8. Uso de información estadística</h2>
      <p>
        La aplicación podrá utilizar información anonimizada para elaborar estadísticas, métricas y reportes sobre el rendimiento de la plataforma, sin que sea posible identificar a los usuarios de forma individual.
      </p>

      <h2>9. Cambios en la Política de Privacidad</h2>
      <p>
        Esta Política de Privacidad podrá ser actualizada cuando resulte necesario para incorporar mejoras, cambios normativos o nuevas funcionalidades de la aplicación. La versión vigente será la publicada dentro de la plataforma.
      </p>

      <h2>10. Aceptación</h2>
      <p>
        Al registrarse y utilizar <strong>Mate+</strong>, el usuario declara haber leído y aceptado esta Política de Privacidad y autoriza el tratamiento de sus datos conforme a las condiciones aquí establecidas.
      </p>
    </div>
  );
}

export default Privacity;