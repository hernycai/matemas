import React from 'react';
import './HeaderMate.css';
import logoMate from '../../../assets/logo_mate.png';

function HeaderMate() {
  return (
    <header className='header_mate'>
      <img src={logoMate} alt="Mate+" className="header_logo" />
    </header>
  );
}

export default HeaderMate;