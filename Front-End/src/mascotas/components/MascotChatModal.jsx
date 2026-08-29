import React, { useState, useEffect, useRef } from 'react';
import './MascotChatModal.css';
import { processMathQuery } from '../core/BotMathEngine';
import { useMascotContext } from '../core/MascotProvider';
import { getMascotConfig } from '../registry';
import { MascotCharacter } from './MascotCharacter';
import {
  FaPaperPlane,
  FaTrashAlt,
  FaCopy,
  FaCheck,
  FaLightbulb,
  FaComments
} from 'react-icons/fa';

export function MascotChatModal({ isOpen, onClose, initialQuery = '' }) {
  const { mascotId, setMascot } = useMascotContext();
  const currentTutorId = mascotId || 'suma';

  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'bot',
      tutorId: currentTutorId,
      text: '¡Hola! Soy tu asistente matemático de **Mate+**. ¿En qué cálculo o situación de la vida diaria puedo ayudarte hoy?',
      steps: [
        '💡 Podés preguntarme sobre **descuentos**, **dividir la cuenta con propina**, **cuotas vs contado**, **recetas de cocina** o escribir cualquier cálculo directo como `(15000 + 4500) / 3`.'
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState(initialQuery);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const tutorConfig = getMascotConfig(currentTutorId);
  const tutorName = tutorConfig?.personality?.name || 'Tutor Mate+';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Procesar con el motor matemático
    setTimeout(() => {
      const response = processMathQuery(text, currentTutorId);
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        tutorId: currentTutorId,
        text: response.text,
        steps: response.steps || null,
        suggestions: response.suggestions || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 250);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-msg-reset',
        sender: 'bot',
        tutorId: currentTutorId,
        text: `¡Chat reiniciado! ¿Qué cálculo o duda matemática tenés hoy?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const quickPrompts = [
    { label: '🏷️ 25% descuento en $34.000', query: '¿Cómo calculo el 25% de descuento en $34.000?' },
    { label: '🍽️ Cuenta $48.000 entre 4', query: 'Dividir una cuenta de $48.000 entre 4 amigos con 10% de propina' },
    { label: '💳 3 cuotas vs contado', query: 'Precio $60.000 al contado vs 3 cuotas de $24.000' },
    { label: '🥖 Receta para 7 personas', query: 'Si 4 porciones llevan 500g de harina, ¿cuánto necesito para 7 porciones?' },
    { label: '💰 Regla 50/30/20 sueldo', query: '¿Cómo organizar mi sueldo de $500.000 con la regla 50/30/20?' },
  ];

  if (!isOpen) return null;

  return (
    <div className="bot-chat-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Chat con Tutor Matemático">
      <div className="bot-chat-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="bot-chat-header">
          <div className="bot-chat-header-info">
            <div className="bot-chat-avatar-wrap">
              <MascotCharacter mascotId={currentTutorId} state="idle" size={48} />
            </div>
            <div>
              <div className="bot-chat-header-title">
                <h3>{tutorName}</h3>
                <span className="bot-chat-online-badge">En línea</span>
              </div>
              <p className="bot-chat-header-sub">Tutor de matemática cotidiana</p>
            </div>
          </div>

          <div className="bot-chat-header-actions">
            <button
              type="button"
              className="bot-chat-icon-btn"
              onClick={handleClearHistory}
              title="Limpiar conversación"
              aria-label="Limpiar conversación"
            >
              <FaTrashAlt size={14} />
            </button>
            <button
              type="button"
              className="bot-chat-close-btn"
              onClick={onClose}
              aria-label="Cerrar chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Selector de Tutor */}
        <div className="bot-tutor-selector" role="tablist" aria-label="Elegir tutor">
          {[
            { id: 'suma', name: 'Suma (+)', desc: 'Finanzas' },
            { id: 'resta', name: 'Resta (−)', desc: 'Descuentos' },
            { id: 'multi', name: 'Multi (×)', desc: 'Cuotas' },
            { id: 'division', name: 'Divi (÷)', desc: 'Cuentas' },
          ].map((tutor) => (
            <button
              key={tutor.id}
              type="button"
              role="tab"
              aria-selected={currentTutorId === tutor.id}
              className={`bot-tutor-chip ${currentTutorId === tutor.id ? 'active' : ''}`}
              onClick={() => setMascot(tutor.id)}
            >
              <span className="tutor-chip-symbol">{tutor.name}</span>
            </button>
          ))}
        </div>

        {/* Chips de Consultas Rápidas */}
        <div className="bot-quick-chips">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              className="bot-quick-chip"
              onClick={() => handleSendMessage(q.query)}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Lista de Mensajes */}
        <div className="bot-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`bot-msg-row ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
              {msg.sender === 'bot' && (
                <div className="bot-msg-avatar">
                  <MascotCharacter mascotId={msg.tutorId || currentTutorId} state="idle" size={32} />
                </div>
              )}

              <div className="bot-msg-bubble">
                <div className="bot-msg-text">
                  {/* Formateo simple de negritas */}
                  {msg.text.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>

                {/* Pasos explicativos detallados */}
                {msg.steps && (
                  <div className="bot-msg-steps">
                    {msg.steps.map((step, idx) => (
                      <div key={idx} className="bot-step-item">
                        {step.split('**').map((part, i) =>
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sugerencias de continuación */}
                {msg.suggestions && (
                  <div className="bot-msg-suggestions">
                    <span className="suggestions-title">
                      <FaLightbulb /> Preguntas recomendadas:
                    </span>
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="suggestion-chip-btn"
                        onClick={() => handleSendMessage(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <div className="bot-msg-footer">
                  <span className="bot-msg-time">{msg.time}</span>
                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      className="bot-msg-copy"
                      onClick={() => handleCopy(msg.id, msg.text + (msg.steps ? '\n' + msg.steps.join('\n') : ''))}
                      title="Copiar respuesta"
                      aria-label="Copiar respuesta"
                    >
                      {copiedId === msg.id ? <FaCheck color="#10B981" size={11} /> : <FaCopy size={11} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de Entrada */}
        <div className="bot-chat-input-area">
          <input
            ref={inputRef}
            type="text"
            className="bot-chat-input"
            placeholder={`Preguntale a ${tutorName} (ej. 20% de 35000 o 45000/3)...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="bot-chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            title="Enviar mensaje"
            aria-label="Enviar mensaje"
          >
            <FaPaperPlane size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
