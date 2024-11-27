import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import importIcon from "../assets/import.svg";
import excelIcon from "../assets/exportExcel.svg";
import pdfIcon from "../assets/exportPdf.svg";
import Search from "../components/search";
import { motion, AnimatePresence } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.15.349/pdf.worker.min.js";

import FacturaService from "../services/FacturaService";

const FacturaList = () => {
  const [facturas, setFacturas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [exportationState, setExportationState] = useState(null);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [file, setFile] = useState(null);
  
  const fileInputRef = useRef(null)
  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("access");

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleExportationOptions = (index) => {
    if (exportationState === index) {
      setExportationState(null);
    } else {
      setExportationState(index);
    }
  };

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await FacturaService.getFacturas();
        if (response.data.length > 0) {
          setFacturas(response.data);
          setFilteredFacturas(response.data); // Inicializa las facturas filtradas con todas las facturas al cargar
          response.data.forEach((factura) => {
            const fechaVencimiento = new Date(factura.fecha_vencimiento);
            const fechaActual = new Date();
            const diferencia = Math.ceil(
              (fechaVencimiento - fechaActual) / (1000 * 3600 * 24)
            );
  
            if (diferencia <= 3 && diferencia > 0) {
              setShowNotification(true);
              setNotificationData(factura);
            }
          });
        } else {
          setMensaje("No se encontraron facturas.");
        }
      } catch (error) {
        console.error("Error al obtener facturas:", error);
        setMensaje("Hubo un error al cargar las facturas.");
      }
    };
  
    if (token) {
      fetchFacturas();
    } else {
      setMensaje("No se encontró el token de acceso.");
    }
  }, [token]);

  console.log(token);
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async (e) => {

    if (!file) {
      fileInputRef.current.click();
      return;
    }

    // Si ya hay un archivo seleccionado, se realiza la importación
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", "cliente");


      try {
        const response = await axios.post(
          "https://trabajofinaldjango.onrender.com/api/auth/importar-facturas-csv/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status === "success") {
          alert("Importación exitosa");
        }
      } catch (error) {
        alert(
          `Error: ${error.response ? error.response.data.message : error.message}`
        );
      }
    }
  };

  const exportOneToPDF = (facturaId) => {
    // Buscar la factura correspondiente
    const factura = facturas.find((factura) => factura.id === facturaId);

    if (!factura) {
      console.error("Factura no encontrada.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Factura Detalles", 20, 10);
    doc.autoTable({
      head: [["Número de Factura", "Estado", "Monto", "Fecha", "Cliente"]],
      body: [
        [
          factura.numero_factura,
          factura.estado,
          factura.monto,
          formatDate(factura.fecha),
          factura.cliente_nombre,
        ],
      ],
    });
    doc.save(`Factura_${factura.numero_factura}.pdf`);
  };

  const exportOneToExcel = (facturaId) => {
    // Buscar la factura correspondiente
    const factura = facturas.find((factura) => factura.id === facturaId);

    if (!factura) {
      console.error("Factura no encontrada.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Número de Factura": factura.numero_factura,
        Estado: factura.estado,
        Monto: factura.monto,
        Fecha: formatDate(factura.fecha),
        Cliente: factura.cliente_nombre,
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Factura");
    XLSX.writeFile(workbook, `Factura_${factura.numero_factura}.xlsx`);
  };

  // Función para exportar todas las facturas a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Facturas", 20, 10);
    doc.autoTable({
      head: [["Número de Factura", "Estado", "Monto", "Fecha", "Cliente"]],
      body: facturas.map((factura) => [
        factura.numero_factura,
        factura.estado,
        factura.monto,
        formatDate(factura.fecha),
        factura.cliente_nombre,
      ]),
    });
    doc.save("facturas.pdf");
  };

  // Función para exportar todas las facturas a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      facturas.map((factura) => ({
        "Número de Factura": factura.numero_factura,
        Estado: factura.estado,
        Monto: factura.monto,
        Fecha: formatDate(factura.fecha),
        Cliente: factura.cliente_nombre,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");
    XLSX.writeFile(workbook, "facturas.xlsx");
  };

  const closeNotification = () => {
    setShowNotification(false);
    setNotificationData(null);
  };

  return (
    <div className="h-screen ml-[10rem] mr-[10rem] w-full p-10 sm:p-6 bg-black text-white  ">

      {/* Notificación */}
      {showNotification && notificationData && (
        <AnimatePresence>
          <motion.div
            className="flex-col fixed top-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-md shadow-lg flex items-center space-x-4"
            initial={{ opacity: 0, x: 50 }} // Comienza desde un estado invisible y desfasado
            animate={{ opacity: 1, x: 0 }} // Finaliza en estado visible y centrado
            exit={{ opacity: 0, x: 50 }} // Cuando se cierre, se desvanece y se mueve hacia la derecha
            transition={{ duration: 0.3 }} // Duración de la animación
          >
            <div>
              <p className="font-bold font-secondary text-lg mb-2">
                Factura a punto de vencer
              </p>
              <p className="font-body">
                Cliente: {notificationData.cliente_nombre}
              </p>
              <p className="font-body mb-2">
                Fecha de vencimiento:{" "}
                {formatDate(notificationData.fecha_vencimiento)}
              </p>
            </div>
            <div className="font-body flex space-x-4">
              <a
                href={`mailto:${notificationData.cliente_nombre}@example.com`}
                className="transition-all bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Enviar Correo
              </a>
              <button
                onClick={closeNotification}
                className="transition-all bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-header font-bold">Lista de Facturas CLIENTES</h1>
        <div className="flex space-x-2 items-center font-body text-md">
          {/* Input de tipo file oculto */}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef} // Referencia al input
            style={{ display: "none" }} // Ocultar el input
          />
          <button
            className="flex btn-primary cursor-pointer p-1 hover:bg-gray-50 hover:bg-opacity-15 transition-all rounded-sm border-white border-[1px] border-opacity-50 px-2 py-1"
            onClick={handleImport} // Activar el flujo de importación
          >
            <img className="pr-2 ml-1" src={importIcon} />
            Importar
          </button>


          <button
            className="flex items-center  btn-primary bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm transition-all"
            onClick={exportToExcel}
          >
            <img className="mr-1" src={excelIcon} />
            <p>Exportar todo</p>
          </button>
          <button
            className="flex items-center btn-primary bg-red-500 hover:bg-red-600 px-2 py-1 rounded-sm transition-all"
            onClick={exportToPDF}
          >
            <img className="mr-1" src={pdfIcon} />
            <p>Exportar todo</p>
          </button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.1,
        }}
        className="flex space-x-2 my-5 w-full outline-none border-none"
      >
        <Search elements={facturas} setFilteredFacturas = {setFilteredFacturas} />
      </motion.div>
      {mensaje && <p className="text-red-500">{mensaje}</p>}
      <motion.table
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
        }}
        className="text-white w-full bg-secondary  shadow rounded-sm overflow-hidden font-body "
      >
        <thead className="bg-tertiary border-b border-opacity-15 border-white hover:bg-tertiaryHover text-left ">
          <tr>
            <th className="px-4 py-2 text-center">Código</th>
            <th className="px-4 pransitxt-center">Estado</th>
            <th className="px-4 py-2 text-center">Monto</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Cliente</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredFacturas.map((factura, index) => (
            <tr
              key={index}
              className="transition-all border-b border-opacity-15 border-white hover:bg-secondaryHover"
            >
              <td className="px-4 py-2">{factura.numero_factura}</td>
              <td className="px-4 py-2">
                <div className="flex justify-center items-center h-full">
                  <span
                    className={`px-3 py-1 text-white rounded-full text-sm ${
                      factura.estado === "pagada"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {factura.estado}
                  </span>
                </div>
              </td>

              <td className="px-4 py-2">${factura.monto}</td>
              <td className="px-4 py-2">{formatDate(factura.fecha)}</td>
              <td className="px-4 py-2">{factura.cliente_nombre}</td>
              <td className="px-4 py-2 text-center relative">
                <button
                  className="text-blue-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                  onClick={() => handleExportationOptions(index)}
                >
                  <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <circle cx="12" cy="6" r="1.5" fill="#ffffff"></circle>
                      <circle cx="12" cy="12" r="1.5" fill="#ffffff"></circle>
                      <circle cx="12" cy="18" r="1.5" fill="#ffffff"></circle>
                    </g>
                  </svg>
                </button>

                <div
                  className={`flex flex-col absolute -translate-x-1/2 -translate-y-1/2 z-10 left-0 bg-black p-2 rounded-sm w-48  text-sm space-y-2 shadow-lg shadow-[rgba(255,255,255,0.1)] duration-150 transform origin-top-left ${
                    exportationState === index
                      ? "animate-fadeIn"
                      : "animate-fadeOut"
                  }`}
                >
                  <button
                    className="flex transition-all text-start p-1 rounded-sm hover:bg-white hover:bg-opacity-15"
                    title="Exportar como PDF"
                    onClick={() => exportOneToPDF(factura.id, "cliente")}
                  >
                    <img className="mr-1" src={pdfIcon} />
                    Exportar como PDF
                  </button>
                  <button
                    className="flex transition-all text-start p-1 rounded-sm hover:bg-white hover:bg-opacity-15"
                    title="Exportar como Excel"
                    onClick={() => exportOneToExcel(factura.id, "cliente")}
                  >
                    <img className="mr-1" src={excelIcon} />
                    Exportar como Excel
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default FacturaList;
