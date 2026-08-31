import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await authService.login(username, password);
      if (success) navigate("/editor");
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] px-4">
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#bd222f]"
      >
        <span>&larr;</span> Volver al inicio
      </Link>

      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[#0d153b] mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#bd222f]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#bd222f]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
