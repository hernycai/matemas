import { FaGithub, FaLinkedin } from 'react-icons/fa';
import teamPhoto from '../../../assets/image.png';
import cesarPhoto from '../../../assets/Fotos/Cesar.jpg';
import isaacPhoto from '../../../assets/Fotos/Isaac.jpg';
import LisandroPhoto from '../../../assets/Fotos/Lisandro.jpg';
import RominaPhoto from '../../../assets/Fotos/Romina.jpg';
import SolPhoto from '../../../assets/Fotos/Sol.jpg';
import FlorPhoto from '../../../assets/Fotos/Flor.jpg';
import SofiaPhoto from '../../../assets/Fotos/Sofia.jpg';
import MaribelPhoto from '../../../assets/Fotos/Maribel.jpg';
import hernanPhoto from '../../../assets/Fotos/hernan.jpg';
import GustavoPhoto from '../../../assets/Fotos/Gustavo.jpg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Nosotros.css';

const teamMembers = [
  {
    name: 'César Ramos',
    role: 'Backend Developer',
    quote: 'Marcar rumbo en estrategia siempre es completamente incierto y absolutamente  necesario.',
    image: cesarPhoto,
    linkedin: '#',
    github: 'https://github.com/cesardevuardo',
  },
  {
    name: 'Isaac Carranza',
    role: 'Backend Developer',
    quote: 'Diseño la arquitectura invisible que sostiene a Mate+, creando una base sólida, segura y lista para escalar.',
    image: isaacPhoto,
    linkedin: 'https://www.linkedin.com/in/isaac-carran/',
    github: 'https://github.com/Isaac-94',
  },
  {
    name: 'Lisandro Salvareschi',
    role: 'Frontend Developer',
    quote: 'Transformo diseños estáticos en experiencias interactivas y fluidas, cuidando cada píxel y cada animación.',
    image: LisandroPhoto,
    linkedin: 'https://www.linkedin.com/in/salvareschilisandro/',
    github: 'https://github.com/Slisandro',
  },
  {
    name: 'Romina Ruiz',
    role: 'Frontend Developer',
    quote: 'Conecto el diseño visual con la potencia del backend, haciendo que el código del navegador cobre vida.',
    image: RominaPhoto,
    linkedin: 'https://www.linkedin.com/in/romina-s-ruiz-/',
    github: 'https://github.com/Romina-Ruiz',
  },
    {
    name: 'Soledad Peloc',
    role: 'Frontend Developer',
    quote: 'Mi meta es que la interfaz de Mate+ no solo sea atractiva, sino rápida, accesible y responsiva en cualquier pantalla.',
    image: SolPhoto,
    linkedin: 'https://www.linkedin.com/in/sol-peloc',
    github: 'https://github.com/SolPeloc',
  },
  {
    name: 'Florencia Luna',
    role: 'Diseñadora UX/UI',
    quote: 'Le doy identidad visual a la plataforma, creando un entorno amigable y estimulante que invita a aprender jugando.',
    image: FlorPhoto,
    linkedin: 'https://www.linkedin.com/in/luna-florencia/',
    github: 'https://github.com/florencialu',
  },
  {
    name: 'Sofía Digiano',
    role: 'Diseñadora UX/UI',
    quote: 'Estudio cómo interactúan los usuarios para diseñar caminos sencillos, intuitivos y libres de frustraciones.',
    image: SofiaPhoto,
    linkedin: 'https://www.linkedin.com/in/sofía-inés-digiano',
    github: 'https://github.com/SofiaDigiano',
  },

    {
    name: 'Maribel Chura Yujra',
    role: 'Tester QA',
    quote: 'Exploro cada rincón de la aplicación buscando fallos para garantizar que la experiencia del usuario sea impecable.',
    image: MaribelPhoto,
    linkedin: '#',
    github: 'https://github.com/maribelchurayujra-cyber',
  },
  {
    name: 'Hernán Luciano',
    role: 'Tester QA',
    quote: 'Desafío al código y automatizo pruebas para que cada actualización de Mate+ salga a la luz sin fricciones.',
    image: hernanPhoto,
    linkedin: 'https://www.linkedin.com/in/hernanluciano/',
    github: 'https://github.com/hernycai',
  },
 
    {
    name: 'Gustavo Ovejero',
    role: 'Coordinador de Proyecto',
    quote: 'Creo soluciones robustas que hacen que la app funcione con velocidad y confiabilidad.',
    image: GustavoPhoto,
    linkedin: 'https://www.linkedin.com/in/gustavo-ovejero/',
    github: 'https://github.com/ovejero92',
  },
  
];

function SecondSection() {
  return (
    <section className="team-section">
      <Container className="team-container py-5">
        <Row className="g-4 justify-content-center">
          {teamMembers.map((member) => (
            <Col key={member.name} xs={12} sm={6} lg={4} xl={3}>
              <article className="team-card">
                <div className="team-card-image">
                  <img src={member.image} alt={`${member.name} perfil`} />
                </div>
                <div className="team-card-body">
                  <h3>{member.name}</h3>
                  <p className="team-card-role">{member.role}</p>
                  <p className="team-card-text">{member.quote}</p>
                </div>
                <div className="team-card-footer">
                  <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`}>
                    <FaLinkedin />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} GitHub`}>
                    <FaGithub />
                  </a>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SecondSection;
