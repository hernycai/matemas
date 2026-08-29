import React from 'react';
import CircleProgress from '../../ui/CircleProgress/CircleProgress';
import './StartDashboard.css';


const StartDashboard = () => {
    return (
        <div className="containerInicio">
          
            <div className="row align-items-center g-4">
                
                {/* Contenedor del Círculo */}
                <div className="col-12 col-md-3 containerCirculo">
                    <Circulo />
                </div>

                {/* Bloques de Progreso */}
                <div className="col-12 col-md-3">
                    <div className="containerProgess">
                        <h4>Nivel</h4>
                        <p>0</p>
                        <small>Usuario Nuevo</small>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="containerProgess">
                        <h4>Total XP</h4>
                        <p>0</p>
                        <small>Puntos</small>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="containerProgess">
                        <h4>Logros</h4>
                        <p>0</p>
                        <small>Algebraico</small>
                    </div>
                </div>
            </div>

           
            <div className="row mt-5">
                <div className="col-12">
                    <div className="infoBlock">
                        <h3>Resumen de progreso</h3>
                        <p>Continúa completando ejercicios para subir de nivel, ganar XP y desbloquear nuevos logros. Aquí puedes ver tu avance general y el siguiente objetivo.</p>
                        <div className="button-container">
                            <button className="option-btn">Practicar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartDashboard;

