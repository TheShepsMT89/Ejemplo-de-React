import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FacturaProveedorForm = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedor, setProveedor] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);

  const token = localStorage.getItem("access");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "https://trabajofinaldjango.onrender.com/api/auth/proveedores/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProveedores(response.data);
      } catch (error) {
        setMensaje("Hubo un error al cargar los proveedores.");
      }
    };

    const fetchUsuario = async () => {
      try {
        const response = await axios.get(
          "https://trabajofinaldjango.onrender.com/api/auth/usuario-logueado/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsuario(response.data);
      } catch (error) {
        setMensaje("Hubo un error al cargar el usuario logueado.");
      }
    };

    if (token) {
      fetchProveedores();
      fetchUsuario();
    } else {
      setMensaje("No se encontró el token de acceso.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proveedor || !monto || !numeroFactura || !fechaVencimiento) {
      setMensaje("Por favor complete todos los campos.");
      return;
    }

    const factura = {
      proveedor,
      monto,
      estado,
      descripcion,
      numero_factura: numeroFactura,
      fecha_vencimiento: fechaVencimiento,
      usuario: usuario ? usuario.id : null,
    };

    try {
      const response = await axios.post(
        "https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/",
        factura,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setMensaje("Factura generada exitosamente");
        setProveedor("");
        setMonto("");
        setEstado("pendiente");
        setDescripcion("");
        setNumeroFactura("");
        setFechaVencimiento("");
      } else {
        setMensaje("Error al generar la factura.");
      }
    } catch (error) {
      setMensaje("Hubo un error al generar la factura.");
    }
  };

  return (
    <div className="ml-[10rem] flex justify-center items-center min-h-screen bg-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary text-white p-6 rounded-sm shadow-md w-11/12 sm:w-9/12 lg:w-1/3 border-white border-[1px] border-opacity-15"
      >
        <h1 className="font-header text-2xl font-bold mb-4 text-center">
          Crear Nueva Factura de Proveedor
        </h1>
        {mensaje && <p className="text-yellow-400 mb-4">{mensaje}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-sm font-medium mb-1">Proveedor</label>
            <select
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Factura
            </label>
            <input
              type="text"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-tertiary text-white rounded-sm p-2 h-36 resize-none"
            />
          </div>
          <button
            type="submit"
            className="transition-all w-full bg-green-600 hover:bg-green-700 text-white py-2 p-3 rounded-sm"
          >
            Generar Factura
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FacturaProveedorForm;
