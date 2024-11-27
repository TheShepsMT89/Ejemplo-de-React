import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../services/loginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const response = await LoginService.verifyLogin(email, password);

      console.log("Respuesta del servidor:", response.data);

      // Guardar tokens en el almacenamiento local
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem(
        "user",
        JSON.stringify({
          nombre: response.data.nombre,
          rol: response.data.rol,
        })
      );

      // Leer el rol del usuario desde la respuesta
      const userRole = response.data.rol;

      // Redireccionar según el rol
      if (userRole === "gerente") {
        navigate("/gerente");
      } else if (userRole === "contador") {
        navigate("/contador");
      } else if (userRole === "admin") {
        navigate("/clientes");
      } else {
        // Si el rol no es válido, puedes redirigir a una página de error o inicio
        setError("Rol no reconocido. Acceso denegado.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response && error.response.status === 400) {
        setError("Credenciales inválidas. Intenta de nuevo.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="flex w-full justify-center items-center text-white h-screen bg-primary">
      <main className="flex flex-col bg-white bg-opacity-10 p-8 rounded-sm h-fit w-[500px] shadow-lg shadow-[rgba(255,255,255,0.1)] ">
        {" "}
        <h2 className="font-header text-2xl text-center font-bold mb-1">
          ¡Bienvenido!
        </h2>
        <h1 className="text-md text-center text-gray-300">
          {" "}
          Inicia sesión con tu cuenta
        </h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <hr className="border-white border-opacity-15" />
        <form className="flex flex-col my-6 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 "> Email: </label>
            <input
              className="input-style"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electronico"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Contraseña:</label>
            <input
              className="input-style"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <div className="flex justify-center items-center ">
            <div class="flex-grow border-t border-white border-opacity-15"></div>
            <button
              className="mx-4 bg-tertiary hover:bg-secondary transition-all px-2 py-1 rounded-sm"
              type="submit"
            >
              Iniciar Sesión
            </button>
            <div class="flex-grow border-t border-white border-opacity-15"></div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
