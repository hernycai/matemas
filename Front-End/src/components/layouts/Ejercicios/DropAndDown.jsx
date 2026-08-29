import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function DragConstraints() {
  const constraintsRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [items, setItems] = useState([
    { id: 1, label: "$1000", color: "#ff6b6b", dropped: false },
    { id: 2, label: "$1200", color: "#ff9f43", dropped: false },
    { id: 3, label: "$200", color: "#feca57", dropped: false },
    { id: 4, label: "$2000", color: "#48dbfb", dropped: false },
  ]);

  const [droppedItems, setDroppedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  // Estado para el bloc de notas
  const [notes, setNotes] = useState([
    { id: 1, text: "Recordatorio: Revisar precios", color: "#fff3cd" },
    { id: 2, text: "Oferta especial - 20% descuento", color: "#d1ecf1" },
  ]);
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const styleId = "responsive-drag-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        textarea:focus {
          outline: none;
          border-color: #FF9800 !important;
          box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
        }
        textarea {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .option-focusable:focus-visible,
        .drop-zone-focusable:focus-visible {
          outline: 3px solid #2563eb !important;
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .app-title {
            margin-top: 10px !important;
            margin-bottom: 16px !important;
            font-size: 1.3rem !important;
          }
          .main-responsive-container {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .options-grid-responsive {
            width: 100% !important;
          }
          .drop-zone-responsive {
            width: 100% !important;
            min-height: 180px !important;
          }
          .top-action-buttons {
            position: relative !important;
            top: 0 !important;
            right: 0 !important;
            width: 100%;
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
          }
          .top-action-buttons button {
            flex: 1;
            padding: 10px !important;
            font-size: 0.9rem !important;
          }
          .notes-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleDrop = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (item && !item.dropped) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, dropped: true } : i))
      );
      setDroppedItems((prev) => [...prev, item]);
      setAriaAnnouncement(`Precio ${item.label} movido a la zona de selección.`);
    }
  };

  const removeFromDrop = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    setDroppedItems((prev) => prev.filter((i) => i.id !== itemId));
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, dropped: false } : i))
    );
    if (item) {
      setAriaAnnouncement(`Precio ${item.label} devuelto a la lista.`);
    }
  };

  const resetQuiz = () => {
    setItems((prev) => prev.map((i) => ({ ...i, dropped: false })));
    setDroppedItems([]);
    setResetKey((prev) => prev + 1);
    setSelectedItem(null);
    setAriaAnnouncement("Ejercicio reiniciado.");
  };

  const toggleSelect = (item) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setAriaAnnouncement(`Deseleccionado ${item.label}.`);
    } else {
      setSelectedItem(item);
      setAriaAnnouncement(`Seleccionado ${item.label}. Presiona Enter en la zona objetivo para moverlo.`);
    }
  };

  const addNote = () => {
    if (newNoteText.trim()) {
      const colors = ["#fff3cd", "#d1ecf1", "#d4edda", "#f8d7da", "#e2d4f0", "#ffe5d9"];
      setNotes((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newNoteText,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
      setNewNoteText("");
    }
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateNote = (id, newText) => {
    if (newText.trim()) {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, text: newText } : note))
      );
    }
    setEditingNote(null);
  };

  return (
    <div style={styles.container}>
      {/* 📢 Anunciador ARIA Live para Lectores de Pantalla */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" style={styles.srOnly}>
        {ariaAnnouncement}
      </div>

      {/* Botones de acción arriba */}
      <div className="top-action-buttons" style={styles.topButtonsGroup}>
        <motion.button
          style={styles.resetButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetQuiz}
          aria-label="Reiniciar ejercicio"
        >
          🔄 Reiniciar
        </motion.button>

        <motion.button
          style={styles.openNotesButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          aria-label={`Abrir bloc de notas, tienes ${notes.length} notas`}
        >
          📝 Bloc ({notes.length})
        </motion.button>
      </div>

      <h1 className="app-title" style={styles.title}>
        💰 Arrastra o selecciona los precios
      </h1>

      <p style={styles.instructions}>
        Instrucción: Arrastra los elementos o selecciónalos con <b>Enter / Espacio</b> para moverlos al objetivo.
      </p>

      <div className="main-responsive-container" style={styles.mainContainer}>
        {/* Opciones disponibles */}
        <div 
          className="options-grid-responsive" 
          style={styles.optionsGrid}
          role="region"
          aria-label="Opciones de precio disponibles"
        >
          <AnimatePresence mode="popLayout">
            {items.map(
              (item) =>
                !item.dropped && (
                  <motion.div
                    key={`${item.id}-${resetKey}`}
                    layoutId={`price-card-${item.id}`} // 👈 Conecta la animación con la zona de drop
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedItem?.id === item.id}
                    aria-label={`Precio ${item.label}. ${selectedItem?.id === item.id ? 'Seleccionado' : 'Presiona Enter para seleccionar'}`}
                    className="option-focusable"
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0}
                    dragMomentum={true}
                    style={{
                      ...styles.option,
                      backgroundColor: item.color,
                      borderColor: item.color,
                      outline: selectedItem?.id === item.id ? "3px solid #111" : "none",
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleSelect(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSelect(item);
                      }
                    }}
                    onDragEnd={(event, info) => {
                      const dropZone = document.querySelector(".drop-zone");
                      if (dropZone) {
                        const rect = dropZone.getBoundingClientRect();
                        if (
                          info.point.x >= rect.left &&
                          info.point.x <= rect.right &&
                          info.point.y >= rect.top &&
                          info.point.y <= rect.bottom
                        ) {
                          handleDrop(item.id);
                          setSelectedItem(null);
                        }
                      }
                    }}
                  >
                    {item.label}
                    <span style={styles.mobileTouchHint}>
                      {selectedItem?.id === item.id ? "✓ Seleccionado" : "Toca / Enter para elegir"}
                    </span>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        {/* Zona para soltar / Drop Zone */}
        <motion.div
          ref={constraintsRef}
          role="button"
          tabIndex={0}
          aria-label={`Zona objetivo para soltar precios. ${droppedItems.length} elementos soltados.`}
          className="drop-zone drop-zone-responsive drop-zone-focusable"
          style={{
            ...styles.dropZone,
            borderColor: droppedItems.length > 0 ? "#4CAF50" : "#2196F3",
            backgroundColor: droppedItems.length > 0 ? "#e8f5e9" : "#e3f2fd",
            boxShadow: selectedItem ? "0 0 0 4px #FF9800" : "none",
          }}
          onClick={() => {
            if (selectedItem) {
              handleDrop(selectedItem.id);
              setSelectedItem(null);
            }
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && selectedItem) {
              e.preventDefault();
              handleDrop(selectedItem.id);
              setSelectedItem(null);
            }
          }}
        >
          {droppedItems.length > 0 ? (
            <div style={styles.droppedItemsContainer}>
              <AnimatePresence mode="popLayout">
                {droppedItems.map((item) => (
                  <motion.button
                    key={`dropped-${item.id}`}
                    layoutId={`price-card-${item.id}`} // 👈 Mismo layoutId para animar la transición hacia la caja
                    type="button"
                    tabIndex={0}
                    aria-label={`Remover precio ${item.label}`}
                    style={{
                      ...styles.droppedItem,
                      backgroundColor: item.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromDrop(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFromDrop(item.id);
                      }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    <span style={styles.removeIcon} aria-hidden="true">✕</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <span style={styles.placeholder}>
              {selectedItem
                ? "👇 Toca o presiona Enter para soltar aquí"
                : "🎯 Arrastra o selecciona un precio"}
            </span>
          )}
        </motion.div>
      </div>

      {droppedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.counter}
          role="status"
        >
          📦 {droppedItems.length} opci{droppedItems.length > 1 ? "ones" : "ón"}{" "}
          seleccionada{droppedItems.length > 1 ? "s" : ""}
        </motion.div>
      )}

      {/* Modal del Bloc de Notas */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              style={styles.modalContainer}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              <div style={styles.modalHeader}>
                <h2 id="modal-title" style={styles.modalTitle}>📝 Bloc de Notas</h2>
                <button
                  style={styles.modalCloseButton}
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <div style={styles.notesArea}>
                {notes.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999" }}>
                    No hay notas aún
                  </p>
                ) : (
                  <div className="notes-grid-responsive" style={styles.notesGrid}>
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        style={{ ...styles.noteCard, backgroundColor: note.color }}
                      >
                        {editingNote === note.id ? (
                          <textarea
                            style={styles.noteTextarea}
                            defaultValue={note.text}
                            autoFocus
                            aria-label="Editar texto de la nota"
                            onBlur={(e) => updateNote(note.id, e.target.value)}
                          />
                        ) : (
                          <>
                            <div style={styles.noteText}>{note.text}</div>
                            <div style={styles.noteActions}>
                              <button
                                style={styles.noteEditButton}
                                onClick={() => setEditingNote(note.id)}
                                aria-label="Editar nota"
                              >
                                ✏️
                              </button>
                              <button
                                style={styles.noteDeleteButton}
                                onClick={() => deleteNote(note.id)}
                                aria-label="Eliminar nota"
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.addNoteArea}>
                <textarea
                  style={styles.addNoteInput}
                  placeholder="Escribe tu nota..."
                  value={newNoteText}
                  aria-label="Nueva nota"
                  onChange={(e) => setNewNoteText(e.target.value)}
                />
                <button
                  style={styles.addNoteButton}
                  onClick={addNote}
                  disabled={!newNoteText.trim()}
                >
                  ➕ Agregar Nota
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  topButtonsGroup: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "8px",
    fontSize: "1.8rem",
    textAlign: "center",
  },
  instructions: {
    fontSize: "0.88rem",
    color: "#555",
    marginBottom: "16px",
    textAlign: "center",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "20px",
    width: "100%",
    maxWidth: "400px",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  option: {
    padding: "14px 10px",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    userSelect: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileTouchHint: {
    fontSize: "0.65rem",
    fontWeight: "normal",
    opacity: 0.85,
    marginTop: "4px",
  },
  dropZone: {
    width: "100%",
    minHeight: "180px",
    backgroundColor: "#e3f2fd",
    border: "3px dashed #2196F3",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    marginTop: "10px",
  },
  droppedItemsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
  },
  droppedItem: {
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    border: "none",
  },
  removeIcon: { fontSize: "0.8rem", opacity: 0.8 },
  placeholder: { color: "#666", fontSize: "0.95rem", textAlign: "center" },
  counter: {
    marginTop: "16px",
    padding: "10px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  resetButton: {
    padding: "10px 18px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  openNotesButton: {
    padding: "10px 18px",
    background: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
    boxSizing: "border-box",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
  },
  modalTitle: { margin: 0, fontSize: "1.2rem" },
  modalCloseButton: { background: "none", border: "none", fontSize: "20px", cursor: "pointer" },
  notesArea: { padding: "16px", overflowY: "auto", flex: 1 },
  notesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  noteCard: { padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" },
  noteText: { fontSize: "13px", wordBreak: "break-word" },
  noteActions: { display: "flex", justifyContent: "flex-end", gap: "6px" },
  noteEditButton: { background: "none", border: "none", cursor: "pointer" },
  noteDeleteButton: { background: "none", border: "none", cursor: "pointer" },
  noteTextarea: { width: "100%", height: "60px", fontSize: "13px" },
  addNoteArea: { padding: "16px", borderTop: "1px solid #eee" },
  addNoteInput: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "8px", boxSizing: "border-box" },
  addNoteButton: { width: "100%", padding: "10px", background: "#FF9800", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
};