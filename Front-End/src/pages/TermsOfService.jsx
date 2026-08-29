import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const Footer = React.lazy(() => import('../components/layouts/Footer/Footer'));
const Header = React.lazy(() => import('../components/layouts/header/Header'));
import ButtonBack from '../components/ui/ButtonBack/ButtonBack';
import Privacity from '../components/layouts/LegalPage/Privacity';
import Terms from '../components/layouts/LegalPage/Terms';
import './TermsOfService.css';

function TermsOfService() {
 const [activeTab, setActiveTab] = useState('privacidad');
 const location = useLocation();
 const navigate = useNavigate();

 useEffect(() => {
   const path = location.pathname.toLowerCase();
   if (path.includes('privacidad')) {
     setActiveTab('privacidad');
     return;
   }
   if (path.includes('terminos')) {
     setActiveTab('terminos');
     return;
   }
   const tabFromState = location?.state?.tab;
   const params = new URLSearchParams(location.search);
   const tabFromQuery = params.get('tab');
   if (tabFromState) setActiveTab(tabFromState);
   else if (tabFromQuery) setActiveTab(tabFromQuery);
 }, [location]);

  const manejarRegresar = () => {
    navigate('/');
  };

  return (
    <div className="legal-page-container">
       <Header />

      <main className="legal-page-content">
        
       
        <div className="tabs-navigation">
          <ButtonBack onClick={manejarRegresar} />
          
          <div className="tabs-buttons-group">
            <button 
              className={`tab-btn ${activeTab === 'privacidad' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacidad')}
            >
              Política de Privacidad
            </button>
            <button 
              className={`tab-btn ${activeTab === 'terminos' ? 'active' : ''}`}
              onClick={() => setActiveTab('terminos')}
            >
              Términos y Condiciones
            </button>
          </div>
        </div>

        <div className="legal-card-body">
          {activeTab === 'privacidad' ? <Privacity /> : <Terms />}
        </div>
      </main>
    </div>
  );
}

export default TermsOfService;