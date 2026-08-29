import React from 'react';
import HeaderMate from '../HeaderMate/HeaderMate';
import errorMascota from '../../../assets/Error_image2.png';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
  
      <HeaderMate />

      
      <main className="not-found-content">
        <div className="not-found-wrapper">
          
        
          <div className="not-found-image-box">
            <img 
              src={errorMascota} 
              alt="Mascota Mate+ Error 404" 
              className="not-found-mascot"
            />
          </div>

          {/* Lado Derecho: Textos informativos */}
          <div className="not-found-text-box">
            <h1 className="not-found-title">ERROR 404</h1>
            <p className="not-found-description">
              Lo sentimos, la página que estás buscando no existe. Podés volver al{' '}
              <a
                href="/"
                className="not-found-link"
              >
                inicio de Mate+
              </a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default NotFound;