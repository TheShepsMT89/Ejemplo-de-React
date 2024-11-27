import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth";

class FacturaService {
  getFacturas() {
    return axios.get(CLIENTE_BASE_REST_API_URL + "/facturas-clientes/");
  }

  setFactura(factura, token) {
    return axios.post(
      "https://trabajofinaldjango.onrender.com/api/auth/facturas-clientes/",
      factura,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getClientes(token) {
    return axios.get(CLIENTE_BASE_REST_API_URL + "/clientes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUserLogued(token) {
    return axios.get("https://trabajofinaldjango.onrender.com/api/auth/usuario-logueado/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new FacturaService();
