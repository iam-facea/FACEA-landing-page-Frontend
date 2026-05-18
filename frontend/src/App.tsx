
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { NavBar } from "./components/layout/NavBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { EditorPage } from "./pages/EditorPage";
import { Navigate } from "react-router-dom";

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

        {/* Ruta Protegida: Editor */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        {/* Alias antiguo para no romper enlaces previos */}
        <Route path="/admin" element={<Navigate to="/editor" replace />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;
