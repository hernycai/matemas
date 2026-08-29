import { ColorRing } from "react-loader-spinner";

const LoadingSpinner = ({ message = "Cargando..." }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0f172a",
                padding: "1rem",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <ColorRing
                    visible
                    height="88"
                    width="88"
                    ariaLabel="cargando-aplicacion"
                    wrapperStyle={{ margin: "0 auto" }}
                    colors={["#22c55e", "#38bdf8", "#facc15", "#fb7185", "#a78bfa"]}
                />
                <p style={{ color: "#e2e8f0", marginTop: "0.75rem", fontWeight: 500 }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;