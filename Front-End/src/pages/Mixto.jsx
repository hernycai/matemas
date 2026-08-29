import { useState } from "react";
import { Container, Row, Col, Modal, Button, Badge } from "react-bootstrap";
import HeaderDash from '../components/layouts/Desafios/headerDash/HeaderDash';
import { useMediaQuery } from "../hooks/useMediaQuery";
import { BiJoystick } from "react-icons/bi";
import { FaFire, FaCoins, FaCheckCircle, FaTimesCircle, FaCalculator, FaArrowRight } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import ModalCalculadora from "../components/layouts/Calculadora/Calculadora";
import "./Dashboard.css";

// Desafíos cotidianos orientados a adultos con matemática práctica
const JUEGOS_MIXTOS = [
  {
    id: 1,
    categoria: "descuentos",
    categoriaLabel: "Compras & Ofertas",
    categoriaIcon: "🏷️",
    dificultad: "Fácil",
    dificultadColor: "success",
    titulo: "Caza de Ofertas Flash",
    descripcion: "Calculá rápido el precio final de productos con 15%, 25% y 40% de descuento en el local.",
    recompensaMonedas: 25,
    recompensaXP: 40,
    imagen: "/mixto/mixto-1.jpg",
    preguntas: [
      {
        q: "Un pantalón de $30.000 tiene 20% de descuento. ¿Cuánto pagás?",
        opciones: ["$24.000", "$26.000", "$22.000"],
        correcta: 0,
        explicacion: "El 20% de $30.000 es $6.000. $30.000 − $6.000 = $24.000."
      },
      {
        q: "Zapatillas de $50.000 con 30% off. ¿Cuánto te ahorrás?",
        opciones: ["$15.000", "$20.000", "$10.000"],
        correcta: 0,
        explicacion: "El 30% de $50.000 es $15.000 de ahorro directo."
      },
      {
        q: "Un electrodoméstico de $80.000 tiene 10% de descuento por pago en efectivo. ¿Precio final?",
        opciones: ["$72.000", "$70.000", "$75.000"],
        correcta: 0,
        explicacion: "10% de $80.000 es $8.000. $80.000 − $8.000 = $72.000."
      }
    ]
  },
  {
    id: 2,
    categoria: "cuentas",
    categoriaLabel: "Cuentas & Propinas",
    categoriaIcon: "🍽️",
    dificultad: "Medio",
    dificultadColor: "primary",
    titulo: "División de Cuentas Entre Amigos",
    descripcion: "Dividí cenas, salidas y deliverys en partes iguales con o sin propina sin demorar la mesa.",
    recompensaMonedas: 30,
    recompensaXP: 50,
    imagen: "/mixto/mixto-2.jpg",
    preguntas: [
      {
        q: "Cena total de $36.000 entre 4 comensales en partes iguales. ¿Cuánto pone cada uno?",
        opciones: ["$9.000", "$8.500", "$10.000"],
        correcta: 0,
        explicacion: "$36.000 ÷ 4 = $9.000 por persona."
      },
      {
        q: "Gasto de $40.000 + 10% de propina. ¿Cuál es el total general?",
        opciones: ["$44.000", "$42.000", "$45.000"],
        correcta: 0,
        explicacion: "$40.000 + $4.000 (10%) = $44.000."
      },
      {
        q: "Almuerzo de $60.000 entre 3 personas con 10% de propina incluida ($66.000 total). ¿Cuánto paga cada uno?",
        opciones: ["$22.000", "$20.000", "$24.000"],
        correcta: 0,
        explicacion: "$66.000 ÷ 3 = $22.000 por persona."
      }
    ]
  },
  {
    id: 3,
    categoria: "finanzas",
    categoriaLabel: "Finanzas del Hogar",
    categoriaIcon: "💳",
    dificultad: "Medio",
    dificultadColor: "primary",
    titulo: "El Dilema de las Cuotas",
    descripcion: "Compará compras al contado vs cuotas con interés y descubrí si realmente conviene financiar.",
    recompensaMonedas: 35,
    recompensaXP: 60,
    imagen: "/mixto/mixto-3.jpg",
    preguntas: [
      {
        q: "Precio contado $90.000 o 3 cuotas fijas de $30.000. ¿Hay recargo?",
        opciones: ["No, 0% recargo (cuotas sin interés reales)", "Sí, 10% de recargo", "Sí, $5.000 de interés"],
        correcta: 0,
        explicacion: "3 × $30.000 = $90.000, igual que el contado."
      },
      {
        q: "Celular por $100.000 al contado o 6 cuotas de $20.000. ¿Cuál es el recargo total financiado?",
        opciones: ["$20.000 (Total $120.000)", "$10.000", "$30.000"],
        correcta: 0,
        explicacion: "6 × $20.000 = $120.000. El recargo es $120.000 − $100.000 = $20.000 (+20%)."
      },
      {
        q: "Con un sueldo de $400.000, aplicando la regla 50/30/20, ¿cuánto destinás al 20% de ahorro?",
        opciones: ["$80.000", "$60.000", "$100.000"],
        correcta: 0,
        explicacion: "El 20% de $400.000 es $80.000."
      }
    ]
  },
  {
    id: 4,
    categoria: "supermercado",
    categoriaLabel: "Precios & Supermercado",
    categoriaIcon: "🛒",
    dificultad: "Desafío",
    dificultadColor: "warning",
    titulo: "Comparador de Gondolas",
    descripcion: "Determiná cuál tamaño o marca conviene más calculando el precio por litro o kilogramo.",
    recompensaMonedas: 40,
    recompensaXP: 65,
    imagen: "/mixto/mixto-4.jpg",
    preguntas: [
      {
        q: "Paquete A: 500g a $2.000 ($4.000/kg). Paquete B: 1kg a $3.500 ($3.500/kg). ¿Cuál rinde más económico?",
        opciones: ["Paquete B (Ahorrás $500 por kg)", "Paquete A", "Cuestan exactamente lo mismo"],
        correcta: 0,
        explicacion: "El paquete B sale $3.500/kg vs $4.000/kg del paquete A."
      },
      {
        q: "Promo 3x2 en latas de $1.200 c/u. Llevás 3 latas. ¿Cuánto pagás en total?",
        opciones: ["$2.400 (pagás solo 2)", "$3.600", "$1.800"],
        correcta: 0,
        explicacion: "En 3x2 pagás 2 latas: 2 × $1.200 = $2.400 (cada una te queda a $800)."
      },
      {
        q: "Segunda unidad al 50% en producto de $4.000. Llevás 2 unidades. ¿Total a pagar?",
        opciones: ["$6.000 ($4.000 + $2.000)", "$7.000", "$5.000"],
        correcta: 0,
        explicacion: "1ra $4.000 + 2da $2.000 = $6.000 total (25% descuento global)."
      }
    ]
  },
  {
    id: 5,
    categoria: "cocina",
    categoriaLabel: "Cocina & Medidas",
    categoriaIcon: "🍳",
    dificultad: "Fácil",
    dificultadColor: "success",
    titulo: "Ajuste de Recetas Familiares",
    descripcion: "Adaptá proporciones e ingredientes de cocina para más comensales usando regla de tres simple.",
    recompensaMonedas: 25,
    recompensaXP: 45,
    imagen: "/mixto/mixto-5.jpg",
    preguntas: [
      {
        q: "Una receta para 4 personas lleva 200g de azúcar. ¿Cuánto azúcar necesitás para 8 personas?",
        opciones: ["400g (el doble)", "300g", "500g"],
        correcta: 0,
        explicacion: "El doble de comensales requiere el doble de azúcar: 200g × 2 = 400g."
      },
      {
        q: "Si 1 kilo son 1.000 gramos, ¿a cuántos gramos equivalen 3/4 kg de carne picada?",
        opciones: ["750 gramos", "500 gramos", "800 gramos"],
        correcta: 0,
        explicacion: "3/4 de 1.000g = (1000 ÷ 4) × 3 = 750g."
      },
      {
        q: "Para 2 pizzas usás 500g de harina. ¿Cuánta harina necesitás para hacer 6 pizzas?",
        opciones: ["1.500g (1.5 kg)", "1.000g", "2.000g"],
        correcta: 0,
        explicacion: "6 pizzas es el triple de 2 pizzas: 500g × 3 = 1.500g."
      }
    ]
  },
  {
    id: 6,
    categoria: "agilidad",
    categoriaLabel: "Agilidad Mental",
    categoriaIcon: "⚡",
    dificultad: "Desafío",
    dificultadColor: "warning",
    titulo: "Cálculo Mental Relámpago",
    descripcion: "Entrená reflejos rápidos con trucos de suma, resta y estimación para no depender del celular.",
    recompensaMonedas: 35,
    recompensaXP: 55,
    imagen: "/mixto/mixto-6.jpg",
    preguntas: [
      {
        q: "¿Cuánto es 150 + 270 + 80 mentalmente?",
        opciones: ["500", "480", "520"],
        correcta: 0,
        explicacion: "150 + 270 = 420. 420 + 80 = 500."
      },
      {
        q: "Tenés $20.000 y gastás $6.400. ¿Cuánto te queda exactamente?",
        opciones: ["$13.600", "$14.600", "$13.400"],
        correcta: 0,
        explicacion: "$20.000 − $6.000 = $14.000 − $400 = $13.600."
      },
      {
        q: "¿El 10% de $87.500?",
        opciones: ["$8.750", "$8.500", "$9.000"],
        correcta: 0,
        explicacion: "Para el 10% corrés la coma un lugar: $8.750."
      }
    ]
  }
];

const CATEGORIAS = [
  { id: "todos", label: "Todos los Desafíos", icon: "✨" },
  { id: "descuentos", label: "Compras & Ofertas", icon: "🏷️" },
  { id: "cuentas", label: "Cuentas & Propinas", icon: "🍽️" },
  { id: "finanzas", label: "Finanzas del Hogar", icon: "💳" },
  { id: "supermercado", label: "Precios & Super", icon: "🛒" },
  { id: "cocina", label: "Cocina & Medidas", icon: "🍳" },
  { id: "agilidad", label: "Agilidad Mental", icon: "⚡" },
];

export default function MixtoPage() {
  const [showHeader, setShowHeader] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [pasoPregunta, setPasoPregunta] = useState(0);
  const [opcionElegida, setOpcionElegida] = useState(null);
  const [esCorrecta, setEsCorrecta] = useState(null);
  const [puntosAcumulados, setPuntosAcumulados] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [isOpenCalculator, setIsOpenCalculator] = useState(false);

  const { updateProfile, profile } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filtrados = categoriaSeleccionada === "todos"
    ? JUEGOS_MIXTOS
    : JUEGOS_MIXTOS.filter((j) => j.categoria === categoriaSeleccionada);

  const iniciarJuego = (juego) => {
    setJuegoActivo(juego);
    setPasoPregunta(0);
    setOpcionElegida(null);
    setEsCorrecta(null);
    setPuntosAcumulados(0);
    setJuegoTerminado(false);
  };

  const seleccionarRespuesta = (index) => {
    if (opcionElegida !== null || !juegoActivo) return;

    setOpcionElegida(index);
    const correcta = index === juegoActivo.preguntas[pasoPregunta].correcta;
    setEsCorrecta(correcta);

    if (correcta) {
      setPuntosAcumulados((prev) => prev + 1);
    }
  };

  const siguientePregunta = () => {
    if (!juegoActivo) return;

    if (pasoPregunta + 1 < juegoActivo.preguntas.length) {
      setPasoPregunta((prev) => prev + 1);
      setOpcionElegida(null);
      setEsCorrecta(null);
    } else {
      // Finalizar juego
      setJuegoTerminado(true);
      if (updateProfile && profile) {
        const nuevosPuntos = (profile.puntos || 0) + juegoActivo.recompensaXP;
        const nuevasMonedas = (profile.monedas || 0) + juegoActivo.recompensaMonedas;
        updateProfile({
          puntos: nuevosPuntos,
          monedas: nuevasMonedas,
        });
      }
    }
  };

  return (
    <main style={{
      backgroundColor: "#F1F5F9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      <ModalCalculadora
        isOpen={isOpenCalculator}
        onClose={() => setIsOpenCalculator(false)}
      />

      <HeaderDash showHeader={showHeader} setShowHeader={setShowHeader} />

      <Container
        fluid="lg"
        style={{
          paddingTop: "95px",
          paddingBottom: "60px",
          maxWidth: "1140px",
          flex: 1,
        }}
      >
        {/* Banner Hero con Alto Contraste */}
        <section
          style={{
            background: "linear-gradient(135deg, #0A3D91 0%, #1E40AF 100%)",
            borderRadius: "24px",
            padding: isMobile ? "2rem 1.25rem" : "2.5rem 2.5rem",
            color: "#FFFFFF",
            boxShadow: "0 10px 25px rgba(10, 61, 145, 0.2)",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 2, maxWidth: "720px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 219, 84, 0.2)",
              border: "1px solid #FFDB54",
              color: "#FFDB54",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}>
              <LuSparkles size={16} />
              <span>MODO PRÁCTICA & AGILIDAD MENTAL</span>
            </div>
            <h1 style={{
              fontSize: isMobile ? "1.8rem" : "2.4rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}>
              Desafíos Mixtos de la Vida Cotidiana
            </h1>
            <p style={{
              fontSize: isMobile ? "1rem" : "1.15rem",
              color: "#E2E8F0",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
            }}>
              Entrená tu mente con compras, descuentos, cuentas compartidas, cuotas y recetas. ¡Sumá monedas y experiencia para subir de nivel!
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button
                variant="warning"
                onClick={() => setIsOpenCalculator(true)}
                style={{
                  backgroundColor: "#FFDB54",
                  color: "#0A3D91",
                  border: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  padding: "10px 18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <FaCalculator />
                <span>Abrir Calculadora de Apoyo</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Filtros de Categorías */}
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span>Explorar por Situación Diaria:</span>
          </h2>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "none",
          }}>
            {CATEGORIAS.map((cat) => {
              const activa = categoriaSeleccionada === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  style={{
                    backgroundColor: activa ? "#0A3D91" : "#FFFFFF",
                    color: activa ? "#FFFFFF" : "#334155",
                    border: activa ? "2px solid #0A3D91" : "1px solid #CBD5E1",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    fontWeight: activa ? 700 : 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                    boxShadow: activa ? "0 4px 10px rgba(10,61,145,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Grilla de Tarjetas con Alto Contraste */}
        <Row className="g-4">
          {filtrados.map((juego) => (
            <Col key={juego.id} xs={12} sm={6} lg={4}>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px solid #E2E8F0",
                  padding: "1.5rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(10, 61, 145, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(15, 23, 42, 0.06)";
                }}
              >
                <div>
                  {/* Header de la Card: Categoría y Dificultad */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <Badge bg="light" text="dark" style={{ border: "1px solid #E2E8F0", fontSize: "0.75rem", padding: "6px 10px", fontWeight: 700 }}>
                      {juego.categoriaIcon} {juego.categoriaLabel}
                    </Badge>
                    <Badge bg={juego.dificultadColor} style={{ fontSize: "0.75rem", padding: "6px 10px", fontWeight: 700 }}>
                      {juego.dificultad}
                    </Badge>
                  </div>

                  {/* Título de alto contraste */}
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}>
                    {juego.titulo}
                  </h3>

                  {/* Descripción clara y legible */}
                  <p style={{
                    fontSize: "0.92rem",
                    color: "#475569",
                    lineHeight: 1.5,
                    marginBottom: "1.25rem",
                  }}>
                    {juego.descripcion}
                  </p>
                </div>

                <div>
                  {/* Recompensas */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "#F8FAFC",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    marginBottom: "1rem",
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 700, color: "#D97706" }}>
                      <FaCoins size={14} color="#D97706" /> +{juego.recompensaMonedas} Monedas
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 700, color: "#2563EB" }}>
                      <FaFire size={14} color="#2563EB" /> +{juego.recompensaXP} XP
                    </span>
                  </div>

                  {/* Botón Jugar Desafío */}
                  <Button
                    variant="primary"
                    onClick={() => iniciarJuego(juego)}
                    style={{
                      width: "100%",
                      backgroundColor: "#0A3D91",
                      border: "none",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: "12px",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 10px rgba(10, 61, 145, 0.25)",
                      cursor: "pointer",
                    }}
                  >
                    <BiJoystick size={20} />
                    <span>Jugar Desafío</span>
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal Interactivo de Minijuego de Práctica */}
      {juegoActivo && (
        <Modal
          show={true}
          onHide={() => setJuegoActivo(null)}
          centered
          backdrop="static"
          size="lg"
          enforceFocus={false}
          autoFocus={false}
        >
          <Modal.Header closeButton style={{ backgroundColor: "#0A3D91", color: "#FFFFFF", border: "none" }}>
            <Modal.Title style={{ fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{juegoActivo.categoriaIcon}</span>
              <span>{juegoActivo.titulo}</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ padding: isMobile ? "1.5rem" : "2rem", backgroundColor: "#F8FAFC" }}>
            {!juegoTerminado ? (
              <div>
                {/* Barra de Progreso del Juego */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748B" }}>
                    Pregunta {pasoPregunta + 1} de {juegoActivo.preguntas.length}
                  </span>
                  <Badge bg="warning" text="dark" style={{ fontWeight: 700 }}>
                    +{juegoActivo.recompensaXP} XP en juego
                  </Badge>
                </div>

                {/* Pregunta */}
                <div style={{
                  backgroundColor: "#FFFFFF",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  border: "1px solid #CBD5E1",
                  marginBottom: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
                }}>
                  <h4 style={{
                    fontSize: isMobile ? "1.15rem" : "1.35rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1.4,
                    margin: 0,
                  }}>
                    {juegoActivo.preguntas[pasoPregunta].q}
                  </h4>
                </div>

                {/* Opciones */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {juegoActivo.preguntas[pasoPregunta].opciones.map((opcion, idx) => {
                    const elegida = opcionElegida === idx;
                    const esLaCorrecta = idx === juegoActivo.preguntas[pasoPregunta].correcta;

                    let btnBg = "#FFFFFF";
                    let btnBorder = "#CBD5E1";
                    let btnColor = "#1E293B";

                    if (opcionElegida !== null) {
                      if (esLaCorrecta) {
                        btnBg = "#DCFCE7";
                        btnBorder = "#16A34A";
                        btnColor = "#166534";
                      } else if (elegida) {
                        btnBg = "#FEE2E2";
                        btnBorder = "#DC2626";
                        btnColor = "#991B1B";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => seleccionarRespuesta(idx)}
                        disabled={opcionElegida !== null}
                        style={{
                          backgroundColor: btnBg,
                          border: `2px solid ${btnBorder}`,
                          color: btnColor,
                          borderRadius: "14px",
                          padding: "14px 18px",
                          fontSize: "1rem",
                          fontWeight: 700,
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: opcionElegida === null ? "pointer" : "default",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>{opcion}</span>
                        {opcionElegida !== null && esLaCorrecta && <FaCheckCircle color="#16A34A" size={18} />}
                        {opcionElegida !== null && elegida && !esLaCorrecta && <FaTimesCircle color="#DC2626" size={18} />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Explicativo */}
                {opcionElegida !== null && (
                  <div style={{
                    backgroundColor: esCorrecta ? "#F0FDF4" : "#FEF2F2",
                    border: `1px solid ${esCorrecta ? "#86EFAC" : "#FECACA"}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}>
                    <p style={{
                      margin: 0,
                      fontWeight: 700,
                      color: esCorrecta ? "#166534" : "#991B1B",
                      fontSize: "0.95rem",
                    }}>
                      {esCorrecta ? "🎉 ¡Excelente respuesta!" : "💡 Explicación del cálculo:"}
                    </p>
                    <p style={{ margin: "4px 0 0 0", color: "#334155", fontSize: "0.9rem" }}>
                      {juegoActivo.preguntas[pasoPregunta].explicacion}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Pantalla de Fin de Juego */
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🏆</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
                  ¡Desafío Completado!
                </h3>
                <p style={{ fontSize: "1.05rem", color: "#475569", marginBottom: "1.5rem" }}>
                  Acertaste <strong>{puntosAcumulados} de {juegoActivo.preguntas.length}</strong> preguntas cotidianas.
                </p>

                <div style={{
                  display: "inline-flex",
                  gap: "1.5rem",
                  backgroundColor: "#FFFFFF",
                  padding: "1rem 2rem",
                  borderRadius: "16px",
                  border: "1px solid #CBD5E1",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  marginBottom: "2rem",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#D97706" }}>+{juegoActivo.recompensaMonedas}</div>
                    <small style={{ fontWeight: 700, color: "#64748B" }}>Monedas Ganadas</small>
                  </div>
                  <div style={{ width: "1px", backgroundColor: "#CBD5E1" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563EB" }}>+{juegoActivo.recompensaXP}</div>
                    <small style={{ fontWeight: 700, color: "#64748B" }}>Puntos XP</small>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer style={{ borderTop: "1px solid #E2E8F0", padding: "1rem 1.5rem", backgroundColor: "#FFFFFF" }}>
            {!juegoTerminado ? (
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  variant="outline-secondary"
                  onClick={() => setIsOpenCalculator(true)}
                  style={{ fontWeight: 700, borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FaCalculator />
                  <span>Calculadora</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={siguientePregunta}
                  disabled={opcionElegida === null}
                  style={{
                    backgroundColor: "#0A3D91",
                    border: "none",
                    fontWeight: 700,
                    borderRadius: "10px",
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{pasoPregunta + 1 === juegoActivo.preguntas.length ? "Ver Resultados" : "Siguiente"}</span>
                  <FaArrowRight size={14} />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => setJuegoActivo(null)}
                style={{
                  width: "100%",
                  backgroundColor: "#0A3D91",
                  border: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  padding: "12px",
                  fontSize: "1rem",
                }}
              >
                Volver a la Galería de Desafíos
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </main>
  );
}