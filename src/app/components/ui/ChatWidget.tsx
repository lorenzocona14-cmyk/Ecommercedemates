import React, { useState } from 'react';
import './ChatWidget.css'; // Asegúrate de que la ruta coincida con tu archivo CSS

const ChatWidget = () => {
  // Estado para controlar si la ventana está abierta o cerrada
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el estado
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget-container">
      
      {/* Ventana del Chat: Se le agrega la clase 'active' si isOpen es true */}
      <div className={`chat-window ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <span>Asistencia en línea</span>
          {/* Al hacer clic en la X, cambiamos el estado */}
          <button onClick={toggleChat}>&times;</button>
        </div>
        <div className="chat-body">
          <p>¡Hola! ¿En qué podemos ayudarte hoy con tus mates?</p>
        </div>
        <div className="chat-input-area">
          <input type="text" placeholder="Escribe tu mensaje..." disabled />
          <button disabled>Enviar</button>
        </div>
      </div>

      {/* Botón Flotante: Al hacer clic, abre o cierra el chat */}
      <button className="chat-fab" onClick={toggleChat}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

    </div>
  );
};

export default ChatWidget;
