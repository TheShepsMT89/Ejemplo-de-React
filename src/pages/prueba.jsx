import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registra los componentes necesarios para el gráfico
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Prueba = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState(null);
  const [graficoData, setGraficoData] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setMensaje("Por favor, proporciona ambas fechas.");
      return;
    }

    // Generar datos de ejemplo para el gráfico
    const periodos = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
    const ingresosMensuales = [5000, 6000, 7000, 8000, 9000];
    const egresosMensuales = [2000, 3000, 4000, 3000, 2000];

    setResultados({
      ingresos: ingresosMensuales.reduce((acc, curr) => acc + curr, 0), // Suma total de ingresos
      egresos: egresosMensuales.reduce((acc, curr) => acc + curr, 0),   // Suma total de egresos
      flujo_caja: ingresosMensuales.reduce((acc, curr) => acc + curr, 0) - egresosMensuales.reduce((acc, curr) => acc + curr, 0), // Flujo de caja
    });

    const data = {
      labels: periodos,
      datasets: [
        {
          label: "Ingresos",
          data: ingresosMensuales,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
        {
          label: "Egresos",
          data: egresosMensuales,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };

    setGraficoData(data);
    setMensaje("");
  };

  return (
    <div className="p-6 ml-[10rem] bg-primary min-h-screen flex justify-center items-center">
      <div className="bg-secondary border-[1px] border-white border-opacity-15 text-white p-8 rounded-md shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 font-header">
          Proyección de Flujo de Caja
        </h1>

        {mensaje && <p className="text-red-500 text-center mb-4">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 font-body">
          <div>
            <label className="block text-sm font-medium">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-lg bg-tertiary border border-secondary text-white focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-lg bg-tertiary border border-secondary text-white focus:outline-none focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
          >
            Obtener Proyección
          </button>
        </form>

        {resultados && (
          <div className="mt-8 bg-tertiary p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-center text-green-400 mb-4 font-header">
              Resultados
            </h2>
            <div className="font-body">
              <p>Ingresos: {resultados.ingresos}</p>
              <p>Egresos: {resultados.egresos}</p>
              <p>Flujo de Caja: {resultados.flujo_caja}</p>
            </div>
          </div>
        )}

        {graficoData && (
          <div className="mt-8 bg-tertiary p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-center text-blue-400 mb-4 font-header">
              Gráfico de Flujo de Caja
            </h2>
            <div style={{ position: "relative", width: "100%", height: "400px" }}>
              <Line data={graficoData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prueba;
