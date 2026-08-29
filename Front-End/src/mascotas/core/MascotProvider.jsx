/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getRandomDialog } from '../registry';
import { MascotChatModal } from '../components/MascotChatModal';

const MascotContext = createContext(null);

export function MascotProvider({
  children,
  defaultMascot = null,
  defaultState = 'idle',
  autoDismissMs = 5000,
}) {
  const [mascotId, setMascotId] = useState(defaultMascot);
  const [state, setStateInternal] = useState(defaultState);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState('');

  const dismissMessage = useCallback(() => {
    setCurrentMessage(null);
    setIsSpeaking(false);
    setStateInternal('idle');
  }, []);

  const setState = useCallback((newState) => {
    setStateInternal(newState);
    if (newState === 'idle') {
      setIsSpeaking(false);
    }
  }, []);

  const openChat = useCallback((query = '', selectedTutor = null) => {
    if (selectedTutor) {
      setMascotId(selectedTutor);
    } else if (!mascotId) {
      setMascotId('suma');
    }
    setInitialChatQuery(query || '');
    setIsChatOpen(true);
  }, [mascotId]);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setInitialChatQuery('');
  }, []);

  const say = useCallback(
    (moment, customMessage) => {
      // Si no hay mascota seleccionada, no hacer nada
      if (!mascotId) {
        console.warn('No hay mascota seleccionada para hablar');
        return;
      }

      const message = customMessage ?? getRandomDialog(mascotId, moment);
      if (!message) return;

      setCurrentMessage(message);
      setIsSpeaking(true);

      const stateMap = {
        correct_answer: 'celebration',
        level_complete: 'celebration',
        wrong_answer: 'sad',
        thinking_prompt: 'thinking',
        hint: 'thinking',
      };

      const mappedState = stateMap[moment];
      if (mappedState) {
        setStateInternal(mappedState);
      }

      if (autoDismissMs > 0) {
        setTimeout(() => {
          setCurrentMessage((prev) => {
            if (prev === message) {
              setIsSpeaking(false);
              setStateInternal('idle');
              return null;
            }
            return prev;
          });
        }, autoDismissMs);
      }
    },
    [mascotId, autoDismissMs],
  );

  const react = useCallback(
    (newState, message) => {
      setStateInternal(newState);

      if (message) {
        setCurrentMessage(message);
        setIsSpeaking(true);

        if (autoDismissMs > 0) {
          setTimeout(() => {
            setCurrentMessage((prev) => {
              if (prev === message) {
                setIsSpeaking(false);
                setStateInternal('idle');
                return null;
              }
              return prev;
            });
          }, autoDismissMs);
        }
      }
    },
    [autoDismissMs],
  );

  const setMascot = useCallback((id) => {
    setMascotId(id);
    setStateInternal('idle');
    setCurrentMessage(null);
    setIsSpeaking(false);
  }, []);

  // Función para limpiar la mascota seleccionada
  const clearMascot = useCallback(() => {
    setMascotId(null);
    setStateInternal('idle');
    setCurrentMessage(null);
    setIsSpeaking(false);
  }, []);

  const value = useMemo(
    () => ({
      mascotId,
      state,
      currentMessage,
      isSpeaking,
      isChatOpen,
      openChat,
      closeChat,
      setMascot,
      setState,
      say,
      react,
      dismissMessage,
      clearMascot,
    }),
    [mascotId, state, currentMessage, isSpeaking, isChatOpen, openChat, closeChat, setMascot, setState, say, react, dismissMessage, clearMascot],
  );

  return (
    <MascotContext.Provider value={value}>
      {children}
      <MascotChatModal
        isOpen={isChatOpen}
        onClose={closeChat}
        initialQuery={initialChatQuery}
      />
    </MascotContext.Provider>
  );
}

export function useMascotContext() {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error('useMascot debe usarse dentro de un <MascotProvider>');
  }
  return ctx;
}