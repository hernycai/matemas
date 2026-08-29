import { TbLadder } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { PiCoinDuotone } from "react-icons/pi";
import { Stack, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Banner.css';

const Banner = () => {
    // Variantes para la animación continua
    const floatJellyVariants = (i) => {
        return {
            initial: {
                scale: 1 * (1 + i * 0.02), // Escala inicial ligeramente diferente para cada ícono
                rotate: 0 * (1 + i * 0.02), // Rotación inicial ligeramente diferente para cada ícono
                y: 0 * (1 + i * 0.02), // Posición vertical inicial ligeramente diferente para cada ícono
            },
            animate: {
                scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
                rotate: [0, 2, -2, 1.5, -1.5, 0],
                y: [0, -4, 4, -2, 2, 0],
                transition: {
                    duration: 5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                }
            }
        }
    };

    return (
        <Stack
            className="banner-grid justify-content-center align-items-center px-3 py-5"
            style={{
                backgroundColor: "black",
                color: "#ffffff",
                borderTopLeftRadius: "40px",
                borderTopRightRadius: "40px"
            }}
        >
            {data.map((item, index) => (
                <Card
                    key={index}
                    className="banner-card text-center p-3 p-md-4 d-flex flex-column align-items-center h-100"
                    style={{
                        backgroundColor: "black",
                        color: "#ffffff",
                        border: "none",
                        width: "100%"
                    }}
                >
                    <motion.div
                        className="mb-3"
                        variants={floatJellyVariants(index)}
                        initial="initial"
                        animate="animate"
                        // Retraso diferente para cada ícono
                        transition={{
                            delay: index * 0.5 * index
                        }}
                        style={{
                            display: "inline-block",
                            transformOrigin: "center center"
                        }}
                    >
                        {item.icon()}
                    </motion.div>
                    <h4 className='m-0 p-0 mb-2' style={{ fontWeight: "600", fontSize: "clamp(18px, 2vw, 24px)" }}>
                        {item.title}
                    </h4>
                    <p
                        className='p-0 mx-auto mb-0'
                        style={{
                            fontSize: "clamp(13px, 1.2vw, 14px)",
                            maxWidth: "90%",
                            lineHeight: "1.6"
                        }}
                        dangerouslySetInnerHTML={{ __html: item.subtitle }}
                    />
                </Card>
            ))}
        </Stack>
    );
};


const data = [
    {
        icon: () => (
            <TbLadder size="60" color="#FFDB54" />
            // <svg width="57" height="59" viewBox="0 0 57 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M56.708 14.8824C56.708 6.66308 50.0449 0 41.8256 0H14.8823C6.66298 0 -9.03213e-05 6.66308 -9.03213e-05 14.8824C-9.03213e-05 21.6608 4.53151 27.3807 10.7304 29.1779C10.7708 29.1897 10.7989 29.2266 10.7989 29.2687C10.7989 29.3107 10.7708 29.3477 10.7304 29.3594C4.53151 31.1567 -9.03213e-05 36.8766 -9.03213e-05 43.655C-9.03213e-05 51.8743 6.66299 58.5374 14.8823 58.5374H41.8256C50.0449 58.5374 56.708 51.8743 56.708 43.655C56.708 36.9209 52.2354 31.2314 46.0987 29.3951C46.0428 29.3784 46.004 29.327 46.004 29.2687C46.004 29.2103 46.0428 29.159 46.0987 29.1422C52.2354 27.306 56.708 21.6165 56.708 14.8824Z" fill="#FFDB54" />
            // </svg>
        ),
        title: "Aprender sin presiones",
        subtitle: "Avanzá desde ejercicios sencillos hasta desafíos más complejos, sin presiones, horarios fijos ni exámenes que estresen."
    },
    {
        icon: () => (
            <FaPlay size="50" color="#FFDB54" />
            // <svg width="61" height="55" viewBox="0 0 61 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M16.4313 11.2397C18.1591 8.49797 19.9176 5.71823 22.2537 3.54112C24.5899 1.35859 27.6161 -0.183297 30.719 0.0175827C33.4437 0.196746 35.9689 1.70606 37.9626 3.67685C39.9562 5.64765 41.5051 8.07449 43.0285 10.4796C47.1486 16.9729 51.2739 23.4662 55.3941 29.965C57.352 33.0487 59.3609 36.2683 59.9028 39.9438C60.5571 44.3849 58.7935 48.9074 55.665 51.8609C52.3934 54.9501 47.0924 54.7003 43.1102 53.8534C38.7447 52.925 34.4763 51.1768 30.0238 51.1822C26.2104 51.1822 22.5247 52.4744 18.8134 53.4136C15.1073 54.3474 11.1252 54.9229 7.54684 53.5331C3.10461 51.812 -0.0851996 46.9203 0.00170246 41.8983C0.0834927 37.3161 4.97046 29.4112 4.97046 29.4112C4.97046 29.4112 12.6118 17.2974 16.4313 11.2397Z" fill="#FFDB54" />
            // </svg>
        ),
        title: "Casos de la vida real",
        subtitle: "Explicaciones en micro-videos de menos de 3 minutos, claras y al grano, con ejemplos prácticos como compras, descuentos y finanzas diarias."
    },
    {
        icon: () => (
            <PiCoinDuotone size="60" color="#FFDB54" />
            // <svg width="55" height="57" viewBox="0 0 55 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M38.0088 4.83118C34.7132 2.43736 33.0654 1.24046 31.3092 0.645451C28.7689 -0.21515 26.0159 -0.21515 23.4757 0.645451C21.7194 1.24046 20.0716 2.43737 16.776 4.83118L9.36536 10.2141C7.40829 11.6356 6.42976 12.3464 5.63208 13.1997C4.47927 14.4329 3.59493 15.8918 3.03499 17.4842C2.64754 18.586 2.47015 19.7822 2.11536 22.1745L0.74327 31.4265C0.120858 35.6235 -0.190348 37.7219 0.123768 39.6133C0.578139 42.3492 1.95125 44.8487 4.0168 46.6999C5.44477 47.9797 7.38303 48.843 11.2596 50.5696L20.0423 54.4814C22.3816 55.5233 23.5512 56.0442 24.7538 56.3105C26.4918 56.6953 28.293 56.6953 30.0311 56.3105C31.2336 56.0442 32.4032 55.5233 34.7425 54.4814L43.5253 50.5696C47.4018 48.843 49.3401 47.9797 50.768 46.6999C52.8336 44.8487 54.2067 42.3492 54.6611 39.6133C54.9752 37.7219 54.664 35.6235 54.0415 31.4265L52.6695 22.1745C52.3147 19.7822 52.1373 18.586 51.7498 17.4842C51.1899 15.8918 50.3055 14.4329 49.1527 13.1997C48.3551 12.3464 47.3765 11.6356 45.4194 10.2141L38.0088 4.83118Z" fill="#FFDB54" />
            // </svg>
        ),
        title: "Recompensas y diversión",
        subtitle: "Ganá monedas a medida que practicás para desbloquear juegos de lógica, estimular tu mente y personalizar tu avatar."
    },
];

export default Banner;