import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Profile = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [avatar, setAvatar] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          "https://trabajofinaldjango.onrender.com/api/auth/usuario-logueado/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { nombre, email, telefono, direccion, avatar } = response.data;
        setNombre(nombre);
        setEmail(email);
        setTelefono(telefono);
        setDireccion(direccion);
        setAvatar(avatar);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setMensaje("Hubo un error al cargar los datos del usuario.");
      }
    };

    fetchUsuario();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      direccion: direccion,
      avatar: avatar,
    };

    try {
      const token = localStorage.getItem("access");
      const response = await axios.put(
        "https://trabajofinaldjango.onrender.com/api/auth/usuario-logueado/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMensaje("Perfil actualizado exitosamente");
      } else {
        setMensaje(
          "Error al actualizar el perfil. Código de estado: " + response.status
        );
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setMensaje(
        "Hubo un error al actualizar el perfil. Detalles: " + error.message
      );
    }
  };

  return (
    <div className="flex ml-[10rem] justify-center items-center min-h-screen bg-primary">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="bg-secondary text-white p-6 rounded-sm shadow-md w-11/12 sm:w-9/12 lg:w-1/3 border-white border-[1px] border-opacity-15 "
      >
        <h1 className="text-2xl font-semibold text-center mb-6 font-header ">
          Editar Perfil
        </h1>
        {mensaje && <p className="text-center text-red-500 mb-4">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium mb-1"
            >
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full bg-tertiary text-white rounded-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-tertiary text-white rounded-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium mb-1"
            >
              Teléfono
            </label>
            <input
              id="telefono"
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="direccion"
              className="block text-sm font-medium mb-1"
            >
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium mb-1"
            >
              Avatar (URL)
            </label>
            <input
              id="avatar"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
            />
          </div>

          <button
            type="submit"
            className="transition-all w-full bg-green-600 hover:bg-green-700 text-white y-2 p-3 rounded-sm"
          >
            Actualizar Perfil
          </button>
        </form>

        {avatar && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-medium">Avatar Actual</h2>
            <img
              src={avatar}
              alt="Avatar"
              className="mx-auto mt-4 w-32 h-32 rounded-full border-1 border-white"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
