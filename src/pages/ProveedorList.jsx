import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminService from "../services/AdminService"; // Asegúrate de que el path sea correcto

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState([]); // Estado para los proveedores
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando
  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes de error

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("access");

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Obtener proveedores de la API
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await AdminService.getProveedor(); // Llamamos al servicio para obtener los proveedores
        setProveedores(response.data); // Guardamos los datos de los proveedores
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        setMensaje("Hubo un error al cargar los proveedores.");
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    fetchProveedores(); // Llamamos a la función para obtener los proveedores
  }, []);

  // Función para manejar la creación de un nuevo proveedor (Puedes agregar la lógica aquí)
  const crearProveedor = () => {
    console.log("Crear nuevo proveedor");
  };

  // Función para manejar la edición de un proveedor
  const editarProveedor = (id) => {
    console.log("Editar proveedor con ID:", id);
  };

  // Función para manejar la eliminación de un proveedor
  const eliminarProveedor = (id) => {
    console.log("Eliminar proveedor con ID:", id);
  };

  return (
    <div className="ml-[10rem] h-screen p-10 sm:p-6 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-header font-bold">Lista de Proveedores</h1>
        <button
          className="flex items-center btn-primary bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm transition-all"
          onClick={crearProveedor}
        >
          <p>Crear nuevo proveedor</p>
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
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <tr
                  key={proveedor.id}
                  className="transition-all border-b border-opacity-15 border-white hover:bg-secondaryHover"
                >
                  <td className="px-4 py-2 text-center">{proveedor.id}</td>
                  <td className="px-4 py-2 text-center">{proveedor.nombre}</td>
                  <td className="px-4 py-2 text-center">{proveedor.email}</td>
                  <td className="px-4 py-2 text-center">{proveedor.telefono}</td>
                  <td className="px-4 py-2 text-center">{proveedor.direccion}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => editarProveedor(proveedor.id)}
                      className="text-blue-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProveedor(proveedor.id)}
                      className="text-red-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay proveedores disponibles</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default ProveedorList;
