import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cuadro from "../components/AdminComponents/Cuadro";
import Barra from "../components/AdminComponents/Barra";
import DashboardService from "../services/DashboardService";

const Dashboard = () => {
  const [totalCobrarCliente, setTotalCobrarCliente] = useState(0); // Total a cobrar
  const [totalPagarCliente, setTotalPagarCliente] = useState(0); // Total a pagar
  const [totalFacturaVencida, setTotalFacturaVencida] = useState(0); // Total de facturas vencidas
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "contador") {
      setRole(userInfo.rol); // Solo si el rol es "admin"
    }

    // Obtener el token de acceso
    const token = localStorage.getItem("access");

    if (token) {
      // Configurar Axios para incluir el token en las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Llamar al servicio para obtener el total a cobrar
      DashboardService.getTotalClientesCobrar(token)
        .then((response) => {
          console.log("Respuesta completa de Cobrar:", response); // Imprime la respuesta completa para depuración
          setTotalCobrarCliente(response.data.total_por_cobrar || 0); // Asegura que sea un valor numérico
        })
        .catch((error) => {
          console.error("Error al obtener el total a cobrar:", error); // Imprime cualquier error
        });

      // Llamar al servicio para obtener el total a pagar
      DashboardService.getTotalClientesPagar(token)
        .then((response) => {
          setTotalPagarCliente(response.data.total_por_pagar || 0); // Asegura que sea un valor numérico
        })
        .catch((error) => {
          console.error("Error al obtener el total a pagar:", error); // Imprime cualquier error
        });
      
      // Llamar al servicio para obtener el total de facturas vencidas
      DashboardService.getTotalFacturaVencida(token)
        .then((response) => {
          setTotalFacturaVencida(response.data.total_facturas_vencidas || 0); // Asegura que sea un valor numérico
        })
        .catch((error) => {
          console.error("Error al obtener el total de facturas vencidas", error); // Imprime cualquier error
        });
    }
  }, []);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  return (
    <main className="flex flex-col ml-40 bg-primary h-screen p-5">
      <div className="grid grid-cols-3 gap-1">
        {/* Cuadro de Cobrar */}
        <Cuadro estilo="bg-secondary hover:bg-secondaryHover" cantidad={totalCobrarCliente} titulo="Pendiente-cliente" />
        {/* Cuadro de Pagar */}
        <Cuadro estilo="bg-secondary hover:bg-secondaryHover" cantidad={totalPagarCliente} titulo="Pagado-cliente" />
        {/* Cuadro de Facturas Vencidas */}
        <Cuadro estilo="bg-red-700 hover:bg-secondaryHover" cantidad={totalFacturaVencida} titulo="Fa. Vencidas-cliente" />

        {/* Otros cuadros */}
        <Cuadro estilo="bg-secondary hover:bg-secondaryHover" cantidad="4" titulo="Pagar" />
        <Cuadro estilo="bg-secondary hover:bg-secondaryHover" cantidad="4" titulo="Cobrar" />
        <Cuadro estilo="bg-red-700 hover:bg-secondaryHover" cantidad="4" titulo="Fa. Vencidas" />
      </div>

      <div className="flex flex-col h-[70%]">
        <div className="mb-3 h-[50%] flex flex-col">
          <h1 className="uppercase text-slate-400 font-semibold ml-2 mb-2">Montos agrupados por mes: CLIENTE</h1>
          <div className="bg-secondary rounded-2xl flex-1 flex flex-row justify-around items-end">
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="50" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="30" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="20" estilo="bg-green-500" />
            <Barra mes="Enero" cantidad="60" estilo="bg-green-500" />
            {/* Puedes seguir llenando las barras aquí */}
          </div>
        </div>

        <div className="h-[50%] flex flex-col">
          <h1 className="uppercase text-slate-400 font-semibold ml-2 mb-2">Montos agrupados por mes: PROVEEDOR</h1>
          <div className="bg-secondary rounded-2xl flex-1 flex flex-row justify-around items-end">
            <div className="h-[50%] w-full mr-1 rounded bg-purple-500"></div>
            {/* Más barras */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
