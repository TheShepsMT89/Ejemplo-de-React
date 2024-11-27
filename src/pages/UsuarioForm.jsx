import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminService from "../services/AdminService"; // Asegúrate de que el path sea correcto

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    rol: "usuario", // Asignamos un rol por defecto, ajusta según lo necesario
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // Para obtener el ID de la URL si estamos editando

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("access");

  // Verificar si el token está presente antes de permitir el acceso al formulario
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirigir a la página de login si no hay token
    }
  }, [token, navigate]);

  // Si existe el ID, significa que estamos editando un usuario
  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        try {
          setLoading(true);
          const response = await AdminService.getUsuarioById(id, token);
          setUsuario(response.data);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
          setMensaje("Hubo un error al cargar los datos del usuario.");
        } finally {
          setLoading(false);
        }
      };

      fetchUsuario();
    }
  }, [id, token]);

  // Maneja el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  // Función para manejar la creación o actualización del usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        password: usuario.password, // Asegúrate de que se envíe correctamente
        rol: usuario.rol,
        // No necesitas enviar 'id' para crear un usuario, solo para actualizar
      };

      if (id) {
        // Si hay un ID, actualizamos el usuario
        await AdminService.actualizarUsuario(id, userData, token);
        setMensaje("Usuario actualizado correctamente.");
      } else {
        // Si no hay ID, creamos un nuevo usuario
        await AdminService.crearUsuario(userData, token);
        setMensaje("Usuario creado correctamente.");
      }

      // Redirigir a la lista de usuarios después de guardar
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al guardar el usuario:", error.response ? error.response.data : error.message);
      setMensaje("Hubo un error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-[10rem] h-screen p-10 sm:p-6 bg-black text-white">
      <h1 className="text-3xl font-header font-bold mb-4">
        {id ? "Editar Usuario" : "Crear Usuario"}
      </h1>

      {mensaje && <p className="text-red-500">{mensaje}</p>} {/* Mensaje de error o éxito */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 text-black mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 text-black border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 text-black border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={usuario.direccion}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 text-black border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            value={usuario.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 text-black border border-gray-300 rounded-md"
          />
        </div>

        <div>
        <label className="block text-sm font-medium">Rol</label>
        <select
          name="rol"
          value={usuario.rol}
          onChange={handleChange}
          className="w-full p-2 mt-1 text-black border border-gray-300 rounded-md"
        >
          <option value="contador">Contador</option>  {/* Cambiado aquí */}
          <option value="gerente">Gerente</option>    {/* Cambiado aquí */}
          <option value="usuario">Usuario</option>   {/* Añadido para incluir rol "usuario" si es necesario */}
        </select>
      </div>


        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Cargando..." : id ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
