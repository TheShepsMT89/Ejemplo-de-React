import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Gerente = () => {
  const [role, setRole] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [facturasClientes, setFacturasClientes] = useState([]);
  const [facturasProveedores, setFacturasProveedores] = useState([]);
  const [usuariosFacturados, setUsuariosFacturados] = useState([]); // Estado para almacenar los datos de usuarios facturados
  const [selectedSection, setSelectedSection] = useState("auditoria"); // Estado para la sección seleccionada
  const navigate = useNavigate(); // Crear una instancia de useNavigate

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "gerente") {
      setRole(userInfo.rol); // Solo si el rol es "gerente"
    }

    // Obtener el token de acceso
    const token = localStorage.getItem("access");

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Obtener los datos desde el backend
    const fetchData = async () => {
      try {
        const [auditLogsResponse, clientesResponse, proveedoresResponse, facturasClientesResponse, facturasProveedoresResponse, usuariosFacturadosResponse] = await Promise.all([
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/audit-logs/"),
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/clientes/"),
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/proveedores/"),
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/facturas-clientes/"),
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/"),
          axios.get("https://trabajofinaldjango.onrender.com/api/auth/total-facturas-por-usuario/", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        setAuditLogs(auditLogsResponse.data);
        setClientes(clientesResponse.data);
        setProveedores(proveedoresResponse.data);
        setFacturasClientes(facturasClientesResponse.data);
        setFacturasProveedores(facturasProveedoresResponse.data);
        setUsuariosFacturados(usuariosFacturadosResponse.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, []);

  const aprobarFactura = async (id, tipo) => {
    try {
      const url = tipo === "cliente"
        ? `https://trabajofinaldjango.onrender.com/api/auth/facturas-clientes/${id}/`
        : `https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/${id}/`;
      const response = await axios.get(url);
      if (response.data.estado === "aprobada") {
        alert("Esta factura ya está aprobada.");
        return;
      }
      await axios.patch(url, { accion: true });
      alert("Factura aprobada exitosamente");
    } catch (error) {
      console.error("Error al aprobar la factura:", error);
    }
  };

  const rechazarFactura = async (id, tipo) => {
    try {
      const url = tipo === "cliente"
        ? `https://trabajofinaldjango.onrender.com/api/auth/facturas-clientes/${id}/`
        : `https://trabajofinaldjango.onrender.com/api/auth/facturas-proveedores/${id}/`;
      await axios.patch(url, { accion: false });
      alert("Factura rechazada exitosamente");
    } catch (error) {
      console.error("Error al rechazar la factura:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://trabajofinaldjango.onrender.com/api/auth/logout/");
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!role) {
    return <div className="text-white">No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  // Función para redirigir a la página de chat
  const irAChat = () => {
    navigate("/chat"); // Redirige a la página de chat
  };

  // Función para redirigir a la página de perfil
  const irAProfile = () => {
    navigate("/profile"); // Redirige a la página de perfil
  };

  const facturasClientesData = {
    labels: facturasClientes.map(factura => factura.numero_factura),
    datasets: [
      {
        label: 'Monto',
        data: facturasClientes.map(factura => factura.monto),
        backgroundColor: facturasClientes.map(factura => factura.estado === 'aprobada' ? 'rgba(75, 192, 192, 0.2)' : factura.estado === 'pendiente' ? 'rgba(255, 206, 86, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
        borderColor: facturasClientes.map(factura => factura.estado === 'aprobada' ? 'rgba(75, 192, 192, 1)' : factura.estado === 'pendiente' ? 'rgba(255, 206, 86, 1)' : 'rgba(255, 99, 132, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const facturasProveedoresData = {
    labels: facturasProveedores.map(factura => factura.numero_factura),
    datasets: [
      {
        label: 'Monto',
        data: facturasProveedores.map(factura => factura.monto),
        backgroundColor: facturasProveedores.map(factura => factura.estado === 'aprobada' ? 'rgba(153, 102, 255, 0.2)' : factura.estado === 'pendiente' ? 'rgba(255, 159, 64, 0.2)' : 'rgba(54, 162, 235, 0.2)'),
        borderColor: facturasProveedores.map(factura => factura.estado === 'aprobada' ? 'rgba(153, 102, 255, 1)' : factura.estado === 'pendiente' ? 'rgba(255, 159, 64, 1)' : 'rgba(54, 162, 235, 1)'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-1/5 bg-gray-800 p-4">
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "auditoria" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("auditoria")}
            >
        trabajadores
            </button>
          </li>
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "clientes" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("clientes")}
            >
              Clientes
            </button>
          </li>
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "proveedores" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("proveedores")}
            >
              Proveedores
            </button>
          </li>
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "facturasClientes" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("facturasClientes")}
            >
              Facturas de Clientes
            </button>
          </li>
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "facturasProveedores" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("facturasProveedores")}
            >
              Facturas de Proveedores
            </button>
          </li>
          <li>
            <button
              className={`w-full px-4 py-2 rounded ${selectedSection === "usuariosFacturados" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setSelectedSection("usuariosFacturados")}
            >
              Usuarios Facturados
            </button>
          </li>
          <li>
            <button
              className="w-full px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold"
              onClick={irAChat}
            >
              Ir al Chat
            </button>
          </li>
          <li>
            <button
              className="w-full px-4 py-2 rounded bg-green-500 hover:bg-green-700 text-white font-bold"
              onClick={irAProfile}
            >
              Perfil
            </button>
          </li>
          <li>
            <button
              className="w-full px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white font-bold"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-4/5 p-4 bg-gray-900 text-white min-h-screen overflow-auto">
        <h2 className="text-3xl font-bold mb-4">Bienvenido, Gerente!</h2>
        <p className="mb-8">Acceso autorizado al área de Gerente.</p>

        {selectedSection === "auditoria" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">flujo de acciones de trabajadores</h3>
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Acción</th>
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Detalles</th>
               
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{log.id}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.timestamp}</td>
                    <td className="px-4 py-2">{log.details}</td>
                    <td className="px-4 py-2">{log.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSection === "clientes" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Clientes</h3>
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{cliente.id}</td>
                    <td className="px-4 py-2">{cliente.nombre}</td>
                    <td className="px-4 py-2">{cliente.email}</td>
                    <td className="px-4 py-2">{cliente.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSection === "proveedores" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Proveedores</h3>
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor) => (
                  <tr key={proveedor.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{proveedor.id}</td>
                    <td className="px-4 py-2">{proveedor.nombre}</td>
                    <td className="px-4 py-2">{proveedor.email}</td>
                    <td className="px-4 py-2">{proveedor.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSection === "facturasClientes" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Facturas de Clientes</h3>
            <div className="mb-4">
              <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded">Aprobada</span>
              <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2">Pendiente</span>
              <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded ml-2">Rechazada</span>
            </div>
            <Bar data={facturasClientesData} />
          </div>
        )}

        {selectedSection === "facturasProveedores" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Facturas de Proveedores</h3>
            <div className="mb-4">
              <span className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded">Aprobada</span>
              <span className="inline-block bg-orange-200 text-orange-800 px-2 py-1 rounded ml-2">Pendiente</span>
              <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded ml-2">Rechazada</span>
            </div>
            <Bar data={facturasProveedoresData} />
          </div>
        )}

        {selectedSection === "usuariosFacturados" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Usuarios que han Facturado</h3>
            <ul className="list-disc list-inside">
              {usuariosFacturados.map((usuario) => (
                <li key={usuario.id} className="mb-2">
                  Nombre: {usuario.nombre}, Email: {usuario.email}, Total Facturas Cliente: {usuario.total_facturas_cliente}, Total Facturas Proveedor: {usuario.total_facturas_proveedor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gerente;