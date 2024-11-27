import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminService from "../services/AdminService"; // Asegúrate de tener el path correcto

const ClienteList = () => {
  const [clientes, setClientes] = useState([]); // Estado para los clientes
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando
  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes de error

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("access");

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Obtener clientes de la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await AdminService.getCliente(); // Llamamos al servicio para obtener los clientes
        setClientes(response.data); // Guardamos los datos de los clientes
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
        setMensaje("Hubo un error al cargar los clientes.");
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    fetchClientes(); // Llamamos a la función para obtener los clientes
  }, []);

  // Función para manejar la creación de un nuevo cliente (Puedes agregar la lógica aquí)
  const crearCliente = () => {
    console.log("Crear nuevo cliente");
  };

  // Función para manejar la edición de un cliente
  const editarCliente = (id) => {
    console.log("Editar cliente con ID:", id);
  };

  // Función para manejar la eliminación de un cliente
  const eliminarCliente = (id) => {
    console.log("Eliminar cliente con ID:", id);
  };

  return (
    <div className="ml-[10rem] p-10 h-screen sm:p-6 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-header font-bold">Lista de Clientes</h1>
        <button
          className="flex items-center btn-primary bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm transition-all"
          onClick={crearCliente}
        >
          <p>Crear nuevo cliente</p>
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
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="transition-all border-b border-opacity-15 border-white hover:bg-secondaryHover"
                >
                  <td className="px-4 py-2 text-center">{cliente.id}</td>
                  <td className="px-4 py-2 text-center">{cliente.nombre}</td>
                  <td className="px-4 py-2 text-center">{cliente.email}</td>
                  <td className="px-4 py-2 text-center">{cliente.telefono}</td>
                  <td className="px-4 py-2 text-center">{cliente.direccion}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => editarCliente(cliente.id)}
                      className="text-blue-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="text-red-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay clientes disponibles</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default ClienteList;
