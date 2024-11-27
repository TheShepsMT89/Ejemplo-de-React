import React, { useState } from 'react';
import axios from 'axios';

const Prueba = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultados, setResultados] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setMensaje('Por favor, proporciona ambas fechas.');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('https://trabajofinaldjango.onrender.com/api/auth/proyeccion-flujo-caja/', {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResultados(response.data);
      setMensaje('');
    } catch (error) {
      console.error('Error al obtener la proyección de flujo de caja:', error);
      setMensaje('Hubo un error al obtener la proyección de flujo de caja.');
    }
  };

  return (
    <div className="ml-[10rem] bg-primary h-screen flex justify-center items-center">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl text-center mb-6">Proyección de Flujo de Caja</h1>

        {mensaje && <p className="text-red-500 text-center mb-4">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Obtener Proyección
          </button>
        </form>

        {resultados && (
          <div className="mt-8 bg-gray-700 p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-center text-green-400 mb-4">Resultados</h2>
            <p>Ingresos: {resultados.ingresos}</p>
            <p>Egresos: {resultados.egresos}</p>
            <p>Flujo de Caja: {resultados.flujo_caja}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prueba;
