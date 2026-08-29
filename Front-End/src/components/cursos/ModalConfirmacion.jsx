import { Modal, Button } from "react-bootstrap";
export default function ModalConfirmacion({ show, handleToDesafios, handleToEjercicios, handleClose }) {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            className="modal-custom"
            centered
        >
            <Modal.Header style={{ display: "flex !important", justifyContent: "center !important" }} className="d-flex justify-content-around" closeButton={false}>
                <Modal.Title>
                    <img src="/mascot.png" alt="Mascot" style={{ width: "80px", borderRadius: "50%", margin: "0 auto" }} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center" style={{ margin: "0 2rem", backgroundColor: "white", borderRadius: "20px", padding: "1rem", fontWeight: "bold", fontSize: "18px" }}>
                ¿Querés ver un video explicativo antes de arrancar? Esto te ayudará a entender mejor el desafío
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-around" style={{ border: "none" }}>
                <Button
                    onClick={handleToEjercicios}
                    style={{
                        borderRadius: "20px",
                        backgroundColor: "#FFDB54",
                        border: "1px solid #FFDB54",
                        color: "black",
                        fontWeight: "semibold",
                        fontSize: "18px",
                        padding: "0.5rem 1.5rem"
                    }}
                >
                    No, continuar
                </Button>
                <Button
                    onClick={handleToDesafios}
                    style={{
                        borderRadius: "20px",
                        backgroundColor: "#FFDB54",
                        border: "1px solid #FFDB54",
                        color: "black",
                        fontWeight: "semibold",
                        fontSize: "18px",
                        padding: "0.5rem 1.5rem"
                    }}
                >
                    Sí, ver video
                </Button>
            </Modal.Footer>
        </Modal>
    )
}