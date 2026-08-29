import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const FooterDash = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

    // Tamaños según dispositivo
    const getSizes = () => {
        if (isMobile) {
            return {
                fontSize: "10px",
                padding: "0 1rem",
                gap: "0.5rem",
                height: "auto",
                minHeight: "50px",
                flexDirection: "column",
                textAlign: "center",
            };
        }
        if (isTablet) {
            return {
                fontSize: "12px",
                padding: "0 2rem",
                gap: "0.75rem",
                height: "40px",
                flexDirection: "row",
                textAlign: "left",
            };
        }
        return {
            fontSize: "16px",
            padding: "0 3rem",
            gap: "1rem",
            height: "40px",
            flexDirection: "row",
            textAlign: "left",
        };
    };

    const sizes = getSizes();

    return (
        <div 
            className="d-flex align-items-center justify-content-between" 
            style={{ 
                width: "100%", 
                height: sizes.height,
                minHeight: sizes.minHeight || "40px",
                gap: sizes.gap,
                padding: sizes.padding,
                flexDirection: sizes.flexDirection,
                backgroundColor: "transparent",
                borderTop: "1px solid #E2E8F0",
                flexWrap: "wrap",
            }}
        >
            {/* Copyright */}
            <p style={{ 
                color: "#1A202C", 
                fontSize: sizes.fontSize, 
                fontWeight: 600,
                margin: 0,
                textAlign: sizes.textAlign,
                width: isMobile ? "100%" : "auto",
            }}>
                ©2026 Equipo 8. Innova Lab
            </p>

            {/* Enlaces legales */}
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                    height: "100%",
                    gap: sizes.gap === "0.5rem" ? "1rem" : sizes.gap === "0.75rem" ? "1.5rem" : "2.5rem",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                    justifyContent: isMobile ? "center" : "flex-end",
                }}
            >
                <p style={{ 
                    color: "#1A202C", 
                    fontSize: sizes.fontSize, 
                    fontWeight: 600,
                    margin: 0,
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    padding: isMobile ? "4px 8px" : "0",
                    // Efecto hover
                    ":hover": {
                        color: "#52C5FE",
                    }
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#52C5FE"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#1A202C"}
                onClick={() => navigate('/privacidad')}
                >
                    Política de Privacidad
                </p>
                <p style={{ 
                    color: "#1A202C", 
                    fontSize: sizes.fontSize, 
                    fontWeight: 600,
                    margin: 0,
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    padding: isMobile ? "4px 8px" : "0",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#52C5FE"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#1A202C"}
                onClick={() => navigate('/terminos')}
                >
                    Términos y Condiciones
                </p>
            </div>
        </div>
    );
};

export default FooterDash;