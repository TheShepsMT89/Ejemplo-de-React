import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Gerente from "./pages/gerente";
import Contador from "./pages/contador";
import Dashboard from "./pages/Dashboard";
import FacturaForm from "./pages/FacturaForm";
import FacturaList from "./pages/FacturaList";
import MainLayout from "./layouts/mainLayout";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import FacturaProveedorForm from "./pages/facturaProveedor";
import Prueba from "./pages/prueba";
import FacturaListProveedor from "./pages/FacturaListaProveedor";
import ClienteList from "./pages/ClienteList";
import ProveedorList from "./pages/ProveedorList";
import UsuarioList from "./pages/UsuarioLista";
import UsuarioForm from "./pages/UsuarioForm";

const contadorItems = [
  { name: "Inicio", path: "/contador" },
  { name: "Formulario de Factura", path: "/factura-form" },
  { name: "Lista de factura cliente", path: "/factura-list" },
  { name: "Edición de perfil", path: "/edit-profile" },
  { name: "Chat", path: "/chat" },
  { name: "Factura del proveedor", path: "/factura-proveedor" },
  { name: "Prueba", path: "/prueba" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Lista de factura proveedor", path: "/factura-List-proveedor" },
];

const adminItems = [
  { name: "Cliente", path: "/clientes" },
  { name: "Proveedor", path: "/proveedor" },
  { name: "Facturas cliente", path: "/facturas-cliente" },
  { name: "Facturas proveedor", path: "/facturas-proveedor" },
  { name: "Usuarios", path: "/usuarios" },
  { name: "UsuarioForm", path: "/UsuarioForm" },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout title="Inicio de Sesión">
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/gerente"
          element={
            <MainLayout title="Gerente">
              <Gerente />
            </MainLayout>
          }
        />
        <Route
          path="/contador"
          element={
            <MainLayout title="Contador" items={contadorItems}>
              <Contador />
            </MainLayout>
          }
        />
        <Route
          path="/factura-form"
          element={
            <MainLayout title="Formulario de factura" items={contadorItems}>
              <FacturaForm />
            </MainLayout>
          }
        />
        <Route
          path="/factura-list"
          element={
            <MainLayout title="Lista de facturas" items={contadorItems}>
              <FacturaList />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout title="Dashboard" items={contadorItems}>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <MainLayout title="Edición de perfil" items={contadorItems}>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout title="Chat" items={contadorItems}>
              <ChatPage />
            </MainLayout>
          }
        />
        <Route
          path="/factura-proveedor"
          element={
            <MainLayout title="Factura del proveedor" items={contadorItems}>
              <FacturaProveedorForm />
            </MainLayout>
          }
        />
        <Route
          path="/factura-List-proveedor"
          element={
            <MainLayout title="Lista de factura proveedor" items={contadorItems}>
              <FacturaListProveedor />
            </MainLayout>
          }
        />
        <Route
          path="/prueba"
          element={
            <MainLayout title="Pruebas" items={contadorItems}>
              <Prueba />
            </MainLayout>
          }
        />
        <Route
          path="/clientes"
          element={
            <MainLayout title="Clientes" items={adminItems}>
              <ClienteList />
            </MainLayout>
          }
        />
        <Route
          path="/proveedor"
          element={
            <MainLayout title="Proveedor" items={adminItems}>
              <ProveedorList />
            </MainLayout>
          }
        />
        <Route
          path="/facturas-cliente"
          element={
            <MainLayout title="Factura cliente" items={adminItems}>
              <FacturaList />
            </MainLayout>
          }
        />
        <Route
          path="/facturas-proveedor"
          element={
            <MainLayout title="Factura proveedor" items={adminItems}>
              <FacturaListProveedor />
            </MainLayout>
          }
        />
        <Route
          path="/usuarios"
          element={
            <MainLayout title="Lista de usarios" items={adminItems}>
              <UsuarioList />
            </MainLayout>
          }
        />
        <Route
          path="/UsuarioForm"
          element={
            <MainLayout title="Crear un usario" items={adminItems}>
              <UsuarioForm />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
