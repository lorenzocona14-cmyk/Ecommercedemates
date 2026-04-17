import { useState } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* Ventana del Chat */}
      <div
        className={`absolute bottom-20 right-0 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-neutral-900 text-white p-4 flex justify-between items-center font-medium">
          <span>Asistencia en línea</span>
          <button 
            onClick={toggleChat} 
            className="text-2xl leading-none hover:text-gray-300 transition-colors"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 p-4 bg-gray-50 text-gray-800 text-sm overflow-y-auto">
          <p>¡Hola! ¿En qué podemos ayudarte hoy con tus mates?</p>
        </div>
        
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            disabled
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full outline-none bg-gray-50 text-sm"
          />
          <button 
            disabled 
            className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm opacity-70 cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Botón Flotante */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-neutral-900 text-white border-none cursor-pointer shadow-lg hover:scale-105 hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      
    </div>
  );
};

export default ChatWidget;
