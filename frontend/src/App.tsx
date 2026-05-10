import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { NavBar } from "./components/layout/NavBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Un componente temporal para el Admin
const AdminDashboard = () => (
  <div className="p-20 text-center">
    <h1 className="text-3xl font-bold">Panel de Administración de Novedades</h1>
    <p>Aquí irá tu CRUD de noticias pronto...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <NavBar />
              <Home />
            </div>
          }
        />

        {/* Ruta de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta Protegida: Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
