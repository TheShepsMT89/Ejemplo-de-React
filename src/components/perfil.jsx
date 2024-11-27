import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios'; // Importar axios

function Perfil() {
  // Estado para controlar la visibilidad del menú
  const [menuVisible, setMenuVisible] = useState(false);

  // Referencia para el div del perfil (segundo div)
  const perfilRef = useRef(null);
  const menuRef = useRef(null); // Referencia para el menú

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
  };

  // Función para cerrar el menú si se hace clic fuera de él
  const handleClickOutside = (event) => {
    if (perfilRef.current && !perfilRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false); // Cerrar el menú si se hace clic fuera de los dos
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Redirigir al usuario a la página de login y limpiar la sesión
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Realizar la solicitud POST para cerrar la sesión en el backend
      await axios.post(`${process.env.REACT_APP_API_URL}auth/logout/`);

      // Eliminar los datos de la sesión (token y usuario) del localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("user");

      // Redirigir a la página de login (ruta que corresponde a "/")
      navigate("/");  // Redirige a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className='text-white w-full h-28 bg-transparent flex justify-center items-center'>
      <div
        ref={perfilRef}  
        className='bg-primary flex justify-center flex-col items-start w-[95%] h-20 rounded-xl duration-500 hover:translate-x-4 cursor-pointer hover:bg-primaryHover border border-slate-500 hover:border-slate-300'
        onClick={toggleMenu}
      >
        <h1 className='ml-3 text-sm mb-3'>Diego</h1>
        <p className='ml-3 text-sm'>diego@gmail.com</p>
      </div>

      {/* Menú pequeño que aparece cuando menuVisible es true */}
      {menuVisible && (
        <div
          ref={menuRef}
          className='absolute left-full ml-4 bottom-20 bg-primary hover:bg-primaryHover text-white p-4 rounded-lg shadow-lg'
        >
          <ul>
            <li className='mb-2'>
              <a href='/configurar' className='hover:text-slate-300'>Configurar</a>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que se cierre el menú
                  handleLogout(); // Ejecutar el logout
                }}
                className='hover:text-slate-300'
                onMouseDown={(e) => e.preventDefault()} // Evitar que toggleMenu se ejecute
              >
                Salir
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Perfil;
