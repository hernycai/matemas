import './Nosotros.css';
import hombre from '../../../assets/Material_Design_6_2.png';

function FirstSection() {
    return (
        <div className="container-nosotros">
            <div className='container-firstSection'>
                <h1 className="title-nosotros">
                    CONOCÉ AL EQUIPO<br />DETRÁS DE MATE+
                </h1>
                
                <p className="subtitle-nosotros">
                    Creamos MATE+ para que dejes de sufrir con las cuentas y empieces a ganarles.<br />
                    ¿Te animás a jugar?
                </p>
                
                <div className="imagen-nosotros">
                    <img src={hombre} alt="Hombre con libro" />
                </div>
            </div>
        </div>
    );
}

export default FirstSection;

