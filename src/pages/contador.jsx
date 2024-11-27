import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Contador = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (userInfo && userInfo.rol === "contador") {
      setRole(userInfo.rol);
    }

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (!role) {
    return (
      <div>
        No tienes acceso a esta área. Inicia sesión con el rol adecuado.
      </div>
    );
  }

  return (
    <div className="ml-[10rem] flex justify-center items-center bg-primary w-full text-white  h-screen">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-2/3 flex justify-center flex-col"
      >
        <h2 className="font-header font-bold text-4xl mb-1">
          Bienvenido, Contador!
        </h2>
        <p className="font-body text-md mb-4">
          Acceso autorizado al área de Contador
        </p>
        <p className="text-gray-500 font-body text-sm">
          {" "}
          Puedes utilizar la barra de navegación para desplazarte por las
          diferentes páginas{" "}
        </p>
      </motion.div>
    </div>
  );
};

export default Contador;
