const useAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken; // Retorna true si el token existe
  };
  
  export default useAuth;
  