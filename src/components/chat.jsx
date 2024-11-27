import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null); // Usuario logueado
  const [mensaje, setMensaje] = useState(''); // Mensaje de estado

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem('access');
  console.log("Token de acceso:", token);

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Fetch para cargar mensajes y usuario logueado
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/simple-messages/`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
        setMensaje("Hubo un error al cargar los mensajes.");
      }
    };

    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/usuario-logueado/`);

        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener el usuario logueado:", error);
        setMensaje("Hubo un error al cargar el usuario logueado.");
      }
    };

    if (token) {
      fetchMessages();
      fetchUsuario();
    } else {
      setMensaje("No se encontró el token de acceso.");
    }
  }, [token]);

  const sendMessage = async () => {
    if (message) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}auth/simple-messages/`, {
          user: usuario.id,
          content: message,
        });
        setMessage('');
        // Actualizar la lista de mensajes
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/simple-messages/`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        setMensaje("Hubo un error al enviar el mensaje.");
      }
    }
  };

  return (
    <div className="bg-primary text-white h-screen p-5 flex flex-col justify-between">
      <h1 className="text-3xl text-center text-white">Chat</h1>
      {mensaje && <p className="text-red-500 text-center">{mensaje}</p>}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.user === usuario.id ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <img
              src={msg.user_avatar || 'default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full mr-3"
              style={{ marginLeft: msg.user === usuario.id ? '0' : '10px' }}
            />
            <div
              className={`${
                msg.user === usuario.id ? 'bg-green-500' : 'bg-gray-800'
              } text-white mx-2 p-3 rounded-sm max-w-4/5 break-words shadow-md`}
            >
              <strong>{msg.user_nombre}:</strong> {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="w-4/5 p-3 bg-secondary focus:bg-secondaryHover text-white rounded-sm border border-white border-opacity-15 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 bg-green-500 text-white rounded-sm transition duration-300 hover:bg-green-400 focus:outline-none"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
