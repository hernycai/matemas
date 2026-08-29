import { useState } from 'react';
import HeaderMate from '../HeaderMate/HeaderMate';
import ButtonBack from '../../ui/ButtonBack/ButtonBack';
import ButtonContinue from '../../ui/ButtonContinue/ButtonContinue';
import { LuSparkles } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';
import './VideoPage.css';

const LESSON_TIPS = {
  "Estrategias de Suma y Resta": {
    icono: "🛒",
    regla: "Agrupá los precios por centenas o miles redondos antes de sumar los detalles.",
    ejemplo: "$4.500 + $8.200 + $2.300 = ($4.500 + $2.300 = $6.800) + $8.200 = $15.000 exactos.",
    puntos: [
      "Para calcular el vuelto de $20.000 con una compra de $16.400: de 16.400 a 17.000 faltan 600, y a 20.000 faltan 3.000 → Vuelto: $3.600.",
      "Redondeá mentalmente para evitar sorpresas en la caja."
    ]
  },
  "Porcentajes": {
    icono: "🏷️",
    regla: "Regla de Oro del 10%: Corré la coma un lugar hacia la izquierda.",
    ejemplo: "En un pantalón de $30.000 con 20% off: el 10% es $3.000. El 20% es $6.000 ($3.000 × 2). Pagás $30.000 − $6.000 = $24.000.",
    puntos: [
      "Para 50% de descuento: Dividí el precio exactamente a la mitad.",
      "Para 25% de descuento: Dividí por 2 y volvé a dividir por 2 (la mitad de la mitad).",
      "Para 15%: Calculá el 10% y sumale su mitad (5%)."
    ]
  },
  "División de Cuentas": {
    icono: "🍽️",
    regla: "Dividí primero los millares grandes y luego los cientos.",
    ejemplo: "Cena de $48.000 entre 4 amigos: $48 ÷ 4 = $12.000 exactos cada uno.",
    puntos: [
      "Propina sugerida del 10%: Simplemente sacale un cero al total de la cuenta.",
      "Si son 5 comensales en $175.000: 175 ÷ 5 = $35.000 por persona."
    ]
  },
  "Cuotas": {
    icono: "💳",
    regla: "Multiplicá el valor de la cuota por la cantidad de meses y restá el precio al contado.",
    ejemplo: "Contado $120.000 vs 6 cuotas de $23.000: 6 × $23.000 = $138.000 → Recargo real: $18.000.",
    puntos: [
      "Si el total en cuotas es idéntico al contado, ¡es 0% de interés real!",
      "Compará siempre el costo financiero antes de endeudarte."
    ]
  },
  "Proporciones": {
    icono: "🍳",
    regla: "Mantené la proporción multiplicando o dividiendo por el mismo factor.",
    ejemplo: "Receta para 4 personas lleva 200g de harina → Para 8 personas (el doble) lleva 400g.",
    puntos: [
      "Regla de tres: Si 3 metros salen $18.000 (cada metro sale $6.000), 5 metros saldrán $30.000.",
      "Consumo de nafta: 8L cada 100km → en 250km son 8 × 2.5 = 20 Litros."
    ]
  }
};

function getTipForTitle(title) {
  const t = String(title || "");
  for (const [key, val] of Object.entries(LESSON_TIPS)) {
    if (t.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(t.toLowerCase())) {
      return val;
    }
  }
  return LESSON_TIPS["Porcentajes"];
}

function VideoPage({
  title,
  videoUrl,
  currentIndex,
  totalVideos,
  onBack,
  onContinue,
}) {
  const [videoError, setVideoError] = useState(false);
  const tip = getTipForTitle(title);

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

        {/* Tarjeta de Lección Explicativa e Interactiva */}
        <div className="video-lesson-card">
          <div className="video-lesson-header">
            <span className="lesson-badge-icon">{tip.icono}</span>
            <div>
              <div className="lesson-badge-pill">
                <LuSparkles /> MICRO-LECCIÓN PRÁCTICA
              </div>
              <h2 className="lesson-card-heading">Estrategia Mental Clave</h2>
            </div>
          </div>

          <div className="lesson-rule-box">
            <strong>💡 Método Rápido:</strong> {tip.regla}
          </div>

          <div className="lesson-example-box">
            <span className="example-tag">EJEMPLO RESUELTO</span>
            <p className="example-text">{tip.ejemplo}</p>
          </div>

          <div className="lesson-points-list">
            {tip.puntos.map((punto, i) => (
              <div key={i} className="lesson-point-item">
                <FaCheckCircle color="#16A34A" size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{punto}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="video-page-footer">
          <ButtonContinue
            onClick={onContinue}
            label="Comenzar Desafío 🚀"
          />
        </div>
      </main>
    </div>
  );
}

export default VideoPage;
