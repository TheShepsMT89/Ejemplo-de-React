import axios from 'axios';

const ADMIN_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth/";

class DashboardService {
    // Centraliza el manejo del token
    getToken() {
        return localStorage.getItem("access");
    }

    getTotalClientesCobrar() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "total-por-cobrar/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getTotalProveedoresCobrar() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "total-por-cobrar/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getTotalClientesPagar() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "total-por-pagar/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getTotalFacturaVencida() {
        const token = this.getToken();
        return axios.get(ADMIN_BASE_REST_API_URL + "facturas-vencidas/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

}

export default new DashboardService();
