import axios from "axios";

// URL base de la API para las facturas de proveedores
const PROVEEDOR_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth";

class FacturaProveedorService {
  // Obtener las facturas de proveedores
  getFacturas() {
    return axios.get(PROVEEDOR_BASE_REST_API_URL + "/facturas-proveedores/");
  }

  // Crear una nueva factura de proveedor
  setFactura(factura, token) {
    return axios.post(
      "https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/", // Ruta para crear factura de proveedor
      factura,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Actualizar una factura de proveedor
  updateFactura(id, factura, token) {
    return axios.put(
      `https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/${id}/`, // Ruta para actualizar factura de proveedor
      factura,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Obtener los proveedores
  getProveedores(token) {
    return axios.get(PROVEEDOR_BASE_REST_API_URL + "/proveedores/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Obtener el usuario logueado
  getUserLogued(token) {
    return axios.get("https://trabajofinaldjango.onrender.com/api/auth/usuario-logueado/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new FacturaProveedorService();
