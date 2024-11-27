import axios from 'axios'; 

const Gerente_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth/audit-logs/";

class GerenteService {
    getAuditoria() {
        return axios.get(Gerente_BASE_REST_API_URL);
    }
}

export default new GerenteService
