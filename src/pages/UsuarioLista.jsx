import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminService from "../services/AdminService"; // Asegúrate de que el path sea correcto

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando
  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes de error

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("access");

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Obtener usuarios de la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await AdminService.getUsuarios(); // Llamamos al servicio para obtener los usuarios
        setUsuarios(response.data); // Guardamos los datos de los usuarios
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setMensaje("Hubo un error al cargar los usuarios.");
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    fetchUsuarios(); // Llamamos a la función para obtener los usuarios
  }, []);

  // Función para manejar la creación de un nuevo usuario
  const crearUsuario = () => {
    console.log("Crear nuevo usuario");
    // Lógica para abrir formulario de creación de usuario
  };

  // Función para manejar la edición de un usuario
  const editarUsuario = (id) => {
    console.log("Editar usuario con ID:", id);
    // Lógica para editar el usuario
  };

  // Función para manejar la eliminación de un usuario
  const eliminarUsuario = async (id) => {
    try {
      await AdminService.eliminarUsuario(id); // Llamada al servicio para eliminar el usuario
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id)); // Eliminamos el usuario de la lista local
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setMensaje("Hubo un error al eliminar el usuario.");
    }
  };

  return (
    <div className="ml-[10rem] mr-[10rem] w-full h-screen p-10 sm:p-6 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-header font-bold">Lista de Usuarios</h1>
        <button
          className="flex items-center btn-primary bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm transition-all"
          onClick={crearUsuario}
        >
          <p>Crear nuevo usuario</p>
        </button>
      </motion.div>

      {mensaje && <p className="text-red-500">{mensaje}</p>} {/* Mostrar mensaje de error */}

      {loading ? (
        <p>Cargando...</p> // Mensaje mientras cargan los datos
      ) : (
        <motion.table
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white w-full bg-secondary shadow rounded-sm overflow-hidden font-body"
        >
          <thead className="bg-tertiary border-b border-opacity-15 border-white hover:bg-tertiaryHover text-left">
            <tr>
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">Nombre</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Teléfono</th>
              <th className="px-4 py-2 text-center">Dirección</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="transition-all border-b border-opacity-15 border-white hover:bg-secondaryHover"
                >
                  <td className="px-4 py-2 text-center">{usuario.id}</td>
                  <td className="px-4 py-2 text-center">{usuario.nombre}</td>
                  <td className="px-4 py-2 text-center">{usuario.email}</td>
                  <td className="px-4 py-2 text-center">{usuario.telefono}</td>
                  <td className="px-4 py-2 text-center">{usuario.direccion}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => editarUsuario(usuario.id)}
                      className="text-blue-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      className="text-red-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay usuarios disponibles</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default UsuarioList;
