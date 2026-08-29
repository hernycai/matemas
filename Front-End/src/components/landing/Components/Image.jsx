import { motion } from "framer-motion";
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import Image from "../../../assets/image.png";

const ShapeImage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getPosition = () => {
    if (isMobile) {
      return { y: 30, x: 0, scale: 0.9 };
    } else if (isTablet) {
      return { y: 40, x: 0, scale: 1 };
    } else {
      return { y: 50, x: 0, scale: 1 };
    }
  };

  const position = getPosition();

  return (
    <motion.div
      className={`${isMobile ? 'd-block' : 'd-none d-lg-block'}`}
      style={{
        position: "relative",
        zIndex: 10,
        width: '100%',
        maxWidth: isMobile ? '250px' : isTablet ? '350px' : '400px',
        margin: isMobile ? '0 auto' : '0',
        padding: isMobile ? '0 1rem' : '0',
      }}
      initial={{
        scale: 0,
        opacity: 0,
        rotate: -30,
      }}
      animate={{
        scale: position.scale,
        opacity: 1,
        rotate: 0,
        y: position.y,
        x: position.x
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        duration: 1.5,
        delay: 0.3,
      }}
    >
      <motion.img
        src={Image}
        alt="Ilustración de aprendizaje de matemáticas de forma divertida"
        loading="eager"
        fetchPriority="high"
        width={isMobile ? "250" : isTablet ? "350" : "400"}
        height="auto"
        whileHover={{
          scale: 1.05,
          rotate: 3,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        }}
        style={{
          width: "100%",
          maxWidth: isMobile ? '250px' : isTablet ? '350px' : '400px',
          height: "auto",
          display: 'block',
        }}
      />
    </motion.div>
  );
};

export default ShapeImage;