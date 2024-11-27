import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "https://trabajofinaldjango.onrender.com/api/auth";

class LoginService {
  verifyLogin(email, password) {
    return axios.post(CLIENTE_BASE_REST_API_URL + "/login/", {
      email,
      contraseña: password,
    });
  }
}

export default new LoginService();
