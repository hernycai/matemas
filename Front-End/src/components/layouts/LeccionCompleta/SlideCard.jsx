import { Button } from "react-bootstrap";

const SlideCard = ({ isActive, onClick, onNext, children, nextLabel = "Siguiente" }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-4 p-4 text-center flex-shrink-0"
      style={{
        cursor: "pointer",
        width: "min(320px, 90vw)",
        minWidth: "min(320px, 90vw)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        opacity: isActive ? 1 : 0.5,
        transform: isActive ? "scale(1)" : "scale(0.9)",
        transition: "all 0.4s ease",
      }}
    >
      {children}
      <Button
        className="w-100 rounded-pill fw-semibold mt-3"
        style={{
          backgroundColor: "#F5C518",
          borderColor: "#F5C518",
          color: "#222",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        {nextLabel}
      </Button>
    </div>
  );
};

export default SlideCard;
