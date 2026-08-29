import { motion } from "framer-motion";
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const ShapeSvg2 = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getPosition = () => {
    if (isMobile) {
      return { y: 80, x: 0, scale: 0.7 };
    } else if (isTablet) {
      return { y: 100, x: 50, scale: 0.9 };
    } else {
      return { y: 0, x: 100, scale: 1 };
    }
  };

  const position = getPosition();

  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: isMobile ? "20px" : "10px",
        left: isMobile ? "10%" : "25%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
      initial={{
        scale: 0,
        opacity: 0,
        y: 500,
        rotate: -360,
      }}
      animate={{
        scale: position.scale,
        opacity: 1,
        y: position.y,
        x: position.x,
        rotate: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        duration: 1.5,
        delay: 0.4,
      }}
    >
      <motion.svg
        width={isMobile ? "130" : "232"}
        height={isMobile ? "130" : "232"}
        viewBox="0 0 232 232"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{
          scale: 1.1,
          rotate: 20,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 40, 0, -4, 0],
          y: [0, 3, 0],
        }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <g clipPath="url(#clip0_436_2311)">
          <path
            d="M120.838 49.5169C139.551 43.7442 159.508 53.8758 165.891 72.3894C167.845 78.0544 171.174 83.1505 175.582 87.2211C189.986 100.524 191.217 122.821 178.36 137.557C174.426 142.066 171.677 147.482 170.358 153.319C166.05 172.394 147.324 184.56 128.083 180.782C122.196 179.626 116.117 179.946 110.391 181.712C91.6781 187.485 71.7211 177.353 65.3377 158.84C63.3844 153.175 60.0547 148.078 55.6471 144.008C41.2428 130.705 40.012 108.408 52.8687 93.6721C56.8028 89.163 59.5522 83.7473 60.8706 77.9103C65.1792 58.8346 83.9055 46.6694 103.146 50.447C109.033 51.6029 115.112 51.2833 120.838 49.5169Z"
            fill="#FFDB54"
            fillOpacity={isMobile ? 0.5 : isTablet ? 0.75 : 1}
          />
        </g>
        <defs>
          <clipPath id="clip0_436_2311">
            <rect
              width="172"
              height="172"
              fill="white"
              transform="translate(77.8611) rotate(26.9158)"
            />
          </clipPath>
        </defs>
      </motion.svg>
    </motion.div>
  );
};

export default ShapeSvg2;