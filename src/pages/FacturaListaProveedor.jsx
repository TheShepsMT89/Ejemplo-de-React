import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FacturaProveedorService from "../services/FacturaProveedorService"; // Asegúrate de importar el servicio

const FacturaListaProveedor = () => {
  const [facturasProveedores, setFacturasProveedores] = useState([]);
  const [exportationState, setExportationState] = useState(null);
  const [editFactura, setEditFactura] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchFacturasProveedores = async () => {
      try {
        const response = await FacturaProveedorService.getFacturas();
        setFacturasProveedores(response.data); // Asignar las facturas a la variable de estado
      } catch (error) {
        console.error("Error al obtener las facturas de proveedores:", error);
      }
    };

    fetchFacturasProveedores();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleExportationOptions = (index) => {
    setExportationState(exportationState === index ? null : index);
  };

  const exportOneToPDF = (facturaId) => {
    const factura = facturasProveedores.find((factura) => factura.id === facturaId);
    if (!factura) return;

    const doc = new jsPDF();
    doc.text("Factura Detalles", 20, 10);
    doc.autoTable({
      head: [["Número de Factura", "Estado", "Monto", "Fecha", "Proveedor"]],
      body: [
        [
          factura.numero_factura,
          factura.estado,
          factura.monto,
          formatDate(factura.fecha),
          factura.proveedor_nombre,
        ],
      ],
    });
    doc.save(`Factura_${factura.numero_factura}.pdf`);
  };

  const exportOneToExcel = (facturaId) => {
    const factura = facturasProveedores.find((factura) => factura.id === facturaId);
    if (!factura) return;

    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Número de Factura": factura.numero_factura,
        Estado: factura.estado,
        Monto: factura.monto,
        Fecha: formatDate(factura.fecha),
        Proveedor: factura.proveedor_nombre,
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Factura");
    XLSX.writeFile(workbook, `Factura_${factura.numero_factura}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Facturas", 20, 10);
    doc.autoTable({
      head: [["Número de Factura", "Estado", "Monto", "Fecha", "Proveedor"]],
      body: facturasProveedores.map((factura) => [
        factura.numero_factura,
        factura.estado,
        factura.monto,
        formatDate(factura.fecha),
        factura.proveedor_nombre,
      ]),
    });
    doc.save("facturas.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      facturasProveedores.map((factura) => ({
        "Número de Factura": factura.numero_factura,
        Estado: factura.estado,
        Monto: factura.monto,
        Fecha: formatDate(factura.fecha),
        Proveedor: factura.proveedor_nombre,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");
    XLSX.writeFile(workbook, "facturas.xlsx");
  };

  return (
    <div className="ml-[10rem]  p-10 sm:p-6 bg-black text-white h-screen">
      {/* Exportación de archivos */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h1 className="text-3xl font-header font-bold">Lista de Facturas de Proveedores</h1>
        <div className="flex space-x-2 items-center font-body text-md">
          <button
            className="flex items-center bg-green-500 hover:bg-green-600 px-2 py-1 rounded-sm"
            onClick={exportToExcel}
          >
            Exportar todo a Excel
          </button>
          <button
            className="flex items-center bg-red-500 hover:bg-red-600 px-2 py-1 rounded-sm"
            onClick={exportToPDF}
          >
            Exportar todo a PDF
          </button>
        </div>
      </motion.div>

      {/* Tabla de facturas */}
      <motion.table
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white w-full bg-secondary shadow rounded-sm overflow-hidden font-body"
      >
        <thead className="bg-tertiary border-b border-opacity-15 border-white hover:bg-tertiaryHover text-left">
          <tr>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Proveedor</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Monto</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {facturasProveedores.map((factura, index) => (
            <tr
              key={factura.id}
              className="transition-all border-b border-opacity-15 border-white hover:bg-secondaryHover"
            >
              <td className="px-4 py-2 text-center">{factura.id}</td>
              <td className="px-4 py-2 text-center">{factura.proveedor_nombre}</td>
              <td className="px-4 py-2 text-center">{formatDate(factura.fecha)}</td>
              <td className="px-4 py-2 text-center">${factura.monto}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-3 py-1 text-white rounded-full text-sm ${
                    factura.estado === "pagada" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {factura.estado}
                </span>
              </td>
              <td className="px-4 py-2 text-center relative">
                <button
                  className="text-blue-500 hover:underline p-2 hover:bg-white hover:bg-opacity-15 rounded-full transition-all"
                  onClick={() => handleExportationOptions(index)}
                >
                  Acciones
                </button>
                <div
                  className={`flex flex-col absolute -translate-x-1/2 -translate-y-1/2 z-10 left-0 bg-black p-2 rounded-sm w-48 text-sm space-y-2 shadow-lg transform origin-top-left ${
                    exportationState === index ? "animate-fadeIn" : "animate-fadeOut"
                  }`}
                >
                  <button
                    className="flex transition-all text-start p-1 rounded-sm hover:bg-white hover:bg-opacity-15"
                    onClick={() => exportOneToPDF(factura.id)}
                  >
                    Exportar como PDF
                  </button>
                  <button
                    className="flex transition-all text-start p-1 rounded-sm hover:bg-white hover:bg-opacity-15"
                    onClick={() => exportOneToExcel(factura.id)}
                  >
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

export default FacturaListaProveedor;
