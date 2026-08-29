import React from 'react';
import './CircleProgress.css';

const CircleProgress = ({ percentage = 70, size = 120, strokeWidth = 10 }) => {
  // Cálculos geométricos para el SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progressContainer" style={{ width: size, height: size }}>
      <svg className="svgElement" width={size} height={size}>
        {/* Círculo de fondo (Track) */}
        <circle
          className="circleTrack"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Círculo de progreso activo */}
        <circle
          className="circleIndicator"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" /* Hace que los bordes del trazo sean redondeados  */
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Texto central */}
      <span className="progressText" style={{ fontSize: `${size * 0.16}px` }}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default CircleProgress;


