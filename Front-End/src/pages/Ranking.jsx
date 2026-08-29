import "./Dashboard.css";
import { Container, Row, Col } from "react-bootstrap";
import HeaderDash from '../components/layouts/Desafios/headerDash/HeaderDash';
import { useMediaQuery } from "../hooks/useMediaQuery";
import FooterDash from "../components/layouts/FooterDash/FooterDash";
import HeaderSection from "../components/layouts/HeaderDashboardCollapse/HeaderDashboardCollapse";
import { useState, useEffect } from "react";
import api from "../config/api";
import fotoPerfilUser from '../assets/Foto_perfil.png';
import LoadingSpinner from "../components/ui/LoadingSpinner";

// ============================================
// SERVICIO DE RANKING (integrado)
// ============================================
const rankingService = {
    getRanking: async (limit = 10) => {
        const response = await api.get(`/ranking?limit=${limit}`);
        return response.data;
    },
    getPodio: async () => {
        const response = await api.get('/ranking/podio');
        return response.data;
    },
    getMiEstadistica: async () => {
        const response = await api.get('/ranking/mi-estadistica');
        return response.data;
    }
};
// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const RankingPage = () => {
    const [showHeader, setShowHeader] = useState(false);
    const [ranking, setRanking] = useState([]);
    const [podio, setPodio] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const cargarRanking = async () => {
            try {
                setCargando(true);
                setError(null);

                // Obtener podio y ranking en paralelo
                const [podioData, rankingData] = await Promise.all([
                    rankingService.getPodio(),
                    rankingService.getRanking(10)
                ]);

                setPodio(podioData.podio || []);
                setRanking(rankingData.ranking || []);
                setUsuarioActual(podioData.usuarioActual || rankingData.usuarioActual);
            } catch (err) {
                console.error("Error al cargar ranking:", err);
                setError("No se pudo cargar el ranking. Intentá de nuevo más tarde.");
            } finally {
                setCargando(false);
            }
        };

        cargarRanking();
    }, []);

    if (cargando) {
        return <LoadingSpinner message="Cargando ranking..." />;
    }

    if (error) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                gap: "1rem",
                padding: "2rem"
            }}>
                <p style={{ color: "#dc2626", fontSize: "1rem", textAlign: "center" }}>
                    {error}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 500
                    }}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <main style={{
            backgroundColor: "transparent",
            minHeight: "100vh",
            height: "max-content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden"
        }}>
            <HeaderDash showHeader={showHeader} setShowHeader={setShowHeader} />
            <Container
                fluid
                className="d-flex align-items-start justify-content-between gap-0 flex-column text-white"
                style={{
                    minHeight: "100vh",
                    width: '100%',
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingBottom: "1rem",
                    marginTop: 85,
                    position: 'relative',
                    overflowY: "auto",
                    backgroundColor: "#FFDB54",
                }}
            >
                <div
                    style={{
                        position: "fixed",
                        width: isMobile ? "150vw" : "110vw",
                        height: isMobile ? "50vh" : "100vh",
                        left: "50%",
                        top: "50%",
                        transform: isMobile ? "translateX(-50%) translateY(10%)" : "translateX(-50%) translateY(-10%)",
                        background: "#8FD8FD75",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                <div style={{
                    display: "grid",
                    gridTemplateRows: showHeader ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    marginBottom: showHeader ? "1rem" : "0",
                    width: "100%",
                    backgroundColor: "transparent"
                }}>
                    <div style={{
                        backgroundColor: "transparent",
                        overflow: "hidden",
                        opacity: showHeader ? 1 : 0,
                        transform: showHeader ? "translateY(0)" : "translateY(-20px)",
                        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}>
                        <HeaderSection isOpen={showHeader} />
                    </div>
                </div>

                {/* Podio con datos reales */}
                <PodioUsuarios podio={podio} usuarioActual={usuarioActual} />

                <div style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    marginTop: "60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 20,
                }}>
                    <Row
                        className="g-4"
                        style={{
                            width: "100%",
                            justifyContent: "center"
                        }}
                    >
                        {ranking.map((usuario) => (
                            <Col
                                key={usuario.id}
                                xs={12}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CardRanking
                                    titulo={usuario.nombre}
                                    index={usuario.posicion}
                                    subtitulo={usuario.titulo}
                                    monedas={usuario.puntos}
                                    esUsuarioActual={usuario.esUsuarioActual}
                                    avatar={usuario.mascota ? `/avatars/${usuario.mascota}.png` : "/user.png"}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* Mostrar usuario actual si no está en el top */}
                    {usuarioActual && !ranking.some(u => u.id === usuarioActual.id) && (
                        <div style={{
                            width: "100%",
                            marginTop: "1rem",
                            borderTop: "2px dashed #ccc",
                            paddingTop: "1rem"
                        }}>
                            <p style={{ color: "#666", fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem" }}>
                                ⭐ Tu posición
                            </p>
                            <CardRanking
                                titulo={usuarioActual.nombre || "Tú"}
                                index={usuarioActual.posicion}
                                subtitulo={usuarioActual.titulo}
                                monedas={usuarioActual.puntos}
                                esUsuarioActual={true}
                                avatar={usuarioActual.mascota ? `/avatars/${usuarioActual.mascota}.png` : "/user.png"}
                            />
                        </div>
                    )}
                </div>
            </Container>

            <FooterDash />
        </main>
    );
};

export default RankingPage;

// ============================================
// COMPONENTE: CardRanking
// ============================================
const CardRanking = ({
    titulo,
    index,
    subtitulo,
    monedas = "0",
    avatar = fotoPerfilUser,
    esUsuarioActual = false
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

    const getSizes = () => {
        if (isMobile) {
            return {
                padding: "12px 16px",
                avatarSize: "40px",
                fontSize: "14px",
                coinSize: "18px",
                gap: "8px",
                borderRadius: "16px",
                numberFontSize: "14px"
            };
        }
        if (isTablet) {
            return {
                padding: "16px 20px",
                avatarSize: "50px",
                fontSize: "16px",
                coinSize: "24px",
                gap: "10px",
                borderRadius: "18px",
                numberFontSize: "16px"
            };
        }
        return {
            padding: "20px 24px",
            avatarSize: "60px",
            fontSize: "20px",
            coinSize: "30px",
            gap: "12px",
            borderRadius: "20px",
            numberFontSize: "18px"
        };
    };

    const sizes = getSizes();

    const getPositionColors = () => {
        if (index === 1) {
            return {
                bg: "#FFF8E1",
                border: "2px solid #FFD700",
                shadow: "0 4px 12px rgba(255, 215, 0, 0.3)"
            };
        }
        if (index === 2) {
            return {
                bg: "#F5F5F5",
                border: "2px solid #C0C0C0",
                shadow: "0 4px 12px rgba(192, 192, 192, 0.3)"
            };
        }
        if (index === 3) {
            return {
                bg: "#FFF5EE",
                border: "2px solid #CD7F32",
                shadow: "0 4px 12px rgba(205, 127, 50, 0.3)"
            };
        }
        return {
            bg: esUsuarioActual ? "#FFF8E1" : "#FFFFFF",
            border: esUsuarioActual ? "2px solid #FFD700" : "none",
            shadow: esUsuarioActual ? "0 4px 12px rgba(255, 215, 0, 0.3)" : "0 2px 8px rgba(0,0,0,0.06)"
        };
    };

    const colors = getPositionColors();

    const getMedalIcon = () => {
        if (index === 1) return "🥇";
        if (index === 2) return "🥈";
        if (index === 3) return "🥉";
        return null;
    };

    const medal = getMedalIcon();

    // Formatear monedas
    const monedasFormateadas = typeof monedas === 'number'
        ? monedas.toLocaleString('es-ES')
        : monedas;

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "black",
            gap: sizes.gap,
            width: "100%",
            background: colors.bg,
            padding: sizes.padding,
            borderRadius: sizes.borderRadius,
            border: colors.border,
            boxShadow: colors.shadow,
            transition: "all 0.3s ease",
            cursor: "pointer",
            flexWrap: isMobile ? "wrap" : "nowrap",
            position: "relative",
            overflow: "hidden",
            minHeight: isMobile ? "70px" : "80px",
        }}
        >
            {/* Badge "TÚ" si es el usuario actual */}
            {esUsuarioActual && (
                <div style={{
                    position: "absolute",
                    top: "4px",
                    right: "8px",
                    fontSize: "12px",
                    backgroundColor: "#FFD700",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: "bold",
                    zIndex: 2
                }}>
                    ⭐ TÚ
                </div>
            )}

            {isMobile && medal && (
                <div style={{
                    position: "absolute",
                    top: "4px",
                    right: esUsuarioActual ? "60px" : "8px",
                    fontSize: "20px",
                    opacity: 0.8
                }}>
                    {medal}
                </div>
            )}

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? "8px" : "12px",
                flex: isMobile ? "1" : "0 0 auto",
                minWidth: isMobile ? "0" : "auto",
                width: isMobile ? "100%" : "auto",
            }}>
                <span style={{
                    fontSize: sizes.numberFontSize,
                    fontWeight: "700",
                    color: index <= 3 ? "#FFD700" : "#999",
                    minWidth: isMobile ? "24px" : "32px",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                }}>
                    #{index}
                </span>

                <div
                    style={{
                        position: "relative",
                        borderRadius: "100%",
                        backgroundImage: `url(${avatar})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: sizes.avatarSize,
                        height: sizes.avatarSize,
                        backgroundColor: "#FFDB54",
                        flexShrink: 0,
                        border: index <= 3 ? `2px solid ${index === 1 ? "#FFD700" : index === 2 ? "#C0C0C0" : "#CD7F32"}` : "none",
                    }}
                >   
                    <img src={fotoPerfilUser} style={{ width: "100%", height: "100%" }} />
                    {!isMobile && medal && (
                        <div style={{
                            position: "absolute",
                            bottom: "-4px",
                            right: "-4px",
                            fontSize: "18px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "2px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                        }}>
                            {medal}
                        </div>
                    )}
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: "2px",
                    minWidth: 0,
                    flex: "1",
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: sizes.fontSize,
                        fontWeight: 600,
                        whiteSpace: isMobile ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isMobile ? "120px" : "200px",
                    }}>
                        {titulo} {esUsuarioActual && "⭐"}
                    </h3>
                    <p style={{
                        color: "#52C5FE",
                        fontSize: `calc(${sizes.fontSize} - 4px)`,
                        margin: 0,
                        whiteSpace: isMobile ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isMobile ? "120px" : "200px",
                    }}>
                        {subtitulo}
                    </p>
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: isMobile ? "6px" : "12px",
                flexShrink: 0,
                marginLeft: isMobile ? "auto" : "0",
                paddingLeft: isMobile ? "8px" : "0",
            }}>
                <img
                    src="/kpis/coin.png"
                    alt="monedas"
                    style={{
                        width: sizes.coinSize,
                        height: sizes.coinSize,
                        objectFit: "contain",
                    }}
                />
                <p style={{
                    color: "black",
                    fontSize: sizes.fontSize,
                    margin: 0,
                    fontWeight: "600",
                    fontVariantNumeric: "tabular-nums",
                }}>
                    {monedasFormateadas}
                </p>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    color: index % 2 === 0 ? "#4CAF50" : "#F44336",
                }}>
                    <img
                        src="/up.png"
                        alt={index % 2 === 0 ? "subir" : "bajar"}
                        style={{
                            width: isMobile ? "16px" : "24px",
                            height: isMobile ? "16px" : "24px",
                            transform: index % 2 === 0 ? "rotate(0deg)" : "rotate(180deg)",
                            transition: "transform 0.3s ease",
                            objectFit: "contain",
                        }}
                    />
                    {!isMobile && (
                        <span style={{
                            fontSize: `calc(${sizes.fontSize} - 6px)`,
                            fontWeight: "500",
                            color: index % 2 === 0 ? "#4CAF50" : "#F44336",
                        }}>
                            {index % 2 === 0 ? "+12%" : "-8%"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================
// COMPONENTE: UserCard (para el podio)
// ============================================
const UserCard = ({
    name,
    title,
    coins,
    isYou = false,
    isFirst = false,
    isSecond = false,
    isThird = false,
    medalImage = "/medalla.png",
    userImage = fotoPerfilUser
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

    const getScale = () => {
        if (isMobile) {
            if (isFirst) return "scale(1)";
            if (isSecond) return "scale(0.95)";
            if (isThird) return "scale(0.9)";
            return "scale(1)";
        }
        if (isFirst) return "scale(1.2)";
        if (isSecond) return "scale(1.1)";
        if (isThird) return "scale(1)";
        return "scale(1)";
    };

    const getSizes = () => {
        if (isMobile) {
            return {
                avatarSize: "70px",
                fontSize: "14px",
                padding: "0.8rem 1rem",
                medalSize: "22px",
                gap: "6px"
            };
        }
        if (isTablet) {
            return {
                avatarSize: "85px",
                fontSize: "16px",
                padding: "1rem 1.5rem",
                medalSize: "26px",
                gap: "8px"
            };
        }
        return {
            avatarSize: "100px",
            fontSize: "20px",
            padding: "1rem 2rem",
            medalSize: "30px",
            gap: "10px"
        };
    };

    const sizes = getSizes();

    // Formatear monedas
    const monedasFormateadas = typeof coins === 'number'
        ? coins.toLocaleString('es-ES')
        : coins;

    return (
        <div
            style={{
                boxShadow: "0px 1px 3px 1px #00000026",
                backgroundColor: isYou ? "#FFF8E1" : "#FFFFFF",
                padding: sizes.padding,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "24px",
                gap: sizes.gap,
                zIndex: 100,
                color: "black",
                transform: getScale(),
                transition: "all 0.3s ease",
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "200px" : "none",
                border: isYou ? "3px solid #FFD700" : "none",
                position: "relative",
                order: isMobile ? (isSecond ? -1 : 0) : 0,
            }}
        >
            {isMobile && (
                <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: isFirst ? "#FFD700" : isSecond ? "#C0C0C0" : "#CD7F32",
                    color: "white",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                    {isFirst ? "1" : isSecond ? "2" : "3"}
                </div>
            )}

            <div
                style={{
                    position: "relative",
                    borderRadius: "100%",
                    backgroundImage: `url(${userImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: sizes.avatarSize,
                    height: sizes.avatarSize,
                    backgroundColor: "#FFDB54",
                    border: isYou ? "3px solid #FFD700" : "none",
                }}
            >
                <img src={fotoPerfilUser} style={{ width: "100%", height: "100%", borderRadius: "100%" }} />
                <img
                    src={medalImage}
                    alt="medalla"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: sizes.medalSize,
                        height: sizes.medalSize,
                    }}
                />
            </div>

            <h2 style={{
                fontSize: sizes.fontSize,
                fontWeight: "600",
                margin: 0,
                textAlign: "center"
            }}>
                {name} {isYou && "⭐"}
            </h2>
            <p style={{
                fontSize: `calc(${sizes.fontSize} - 4px)`,
                fontWeight: 400,
                margin: 0,
                textAlign: "center"
            }}>
                {title}
            </p>
            <span style={{
                fontSize: `calc(${sizes.fontSize} - 4px)`,
                fontWeight: 400,
                margin: 0,
                textAlign: "center",
                color: "#52C5FE"
            }}>
                {monedasFormateadas} Monedas+
            </span>
        </div>
    );
};

// ============================================
// COMPONENTE: PodioUsuarios
// ============================================
const PodioUsuarios = ({ podio = [] }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (podio.length === 0) {
        return (
            <div style={{
                textAlign: "center",
                padding: "2rem",
                color: "#666"
            }}>
                <p>No hay usuarios en el podio todavía.</p>
                <p style={{ fontSize: "0.9rem" }}>¡Completa ejercicios para aparecer aquí!</p>
            </div>
        );
    }

    // Obtener los 3 primeros
    const [primero, segundo, tercero] = podio;

    // En mobile, el orden es: 2do, 1ro, 3ro
    const ordenMobile = [segundo, primero, tercero].filter(Boolean);
    const ordenDesktop = [segundo, primero, tercero];

    const usuariosOrdenados = isMobile ? ordenMobile : ordenDesktop;

    return (
        <div
            style={{
                display: "flex",
                alignItems: isMobile ? "center" : "flex-end",
                justifyContent: isMobile ? "center" : "space-around",
                width: "100%",
                gap: isMobile ? "16px" : "30px",
                flexDirection: isMobile ? "column" : "row",
                padding: isMobile ? "1rem 0.5rem" : "0",
                minHeight: isMobile ? "auto" : "300px",
            }}
        >
            {usuariosOrdenados.map((usuario) => (
                <UserCard
                    key={usuario.id}
                    name={usuario.nombre}
                    title={usuario.titulo}
                    coins={usuario.puntos || 0}
                    isFirst={usuario.posicion === 1}
                    isSecond={usuario.posicion === 2}
                    isThird={usuario.posicion === 3}
                    isYou={usuario.esUsuarioActual}
                    userImage={usuario.mascota ? `/avatars/${usuario.mascota}.png` : "/user.png"}
                    medalImage="/medalla.png"
                />
            ))}
        </div>
    );
};