import axios from 'axios';

const ADMIN_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth/";

class AdminService {
    // Centraliza el manejo del token
    getToken() {
        return localStorage.getItem("access");
    }

    getCliente() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "clientes/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getProveedor() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "proveedores/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getUsuarios() {
        const token = this.getToken();
        return axios.get(`${ADMIN_BASE_REST_API_URL}admin/usuarios/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      crearUsuario(usuarioData) {
        const token = this.getToken();
        return axios.post(`${ADMIN_BASE_REST_API_URL}admin/usuarios/`, usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      actualizarUsuario(id, usuarioData) {
        const token = this.getToken();
        return axios.put(`${ADMIN_BASE_REST_API_URL}admin/usuarios/${id}/`, usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      eliminarUsuario(id) {
        const token = this.getToken();
        return axios.delete(`${ADMIN_BASE_REST_API_URL}admin/usuarios/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      

}

export default new AdminService();
