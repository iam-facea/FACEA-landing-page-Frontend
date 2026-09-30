import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { authService } from "../services/authService";

// Función espía para simular la navegación sin depender de un navegador real
const mockNavigate = vi.fn();

// Mock del enrutador de React Router: interceptamos useNavigate para capturar la redirección
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Flujo de Login en LoginPage", () => {
  // Limpieza previa a cada test: resetea llamadas y estados de los mocks
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe iniciar sesión con credenciales válidas y navegar al panel del editor", async () => {
    // ==========================================
    // 1. ARRANGE (Organizar / Preparar el entorno)
    // ==========================================
    // Simulamos que el servicio de autenticación responde exitosamente (true)
    vi.spyOn(authService, "login").mockResolvedValueOnce(true);
    const user = userEvent.setup();

    // Renderizamos el componente dentro del enrutador en memoria
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Obtenemos los elementos de la interfaz mediante accesibilidad (labels y roles)
    const userInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT (Actuar / Ejecutar la interacción)
    // ==========================================
    // El usuario ingresa sus credenciales válidas y presiona el botón de envío
    await user.type(userInput, "admin");
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    // ==========================================
    // 3. ASSERT (Afirmar / Verificar el resultado)
    // ==========================================
    // Verificamos que se haya invocado al servicio con las credenciales correctas
    expect(authService.login).toHaveBeenCalledWith("admin", "123");
    // Verificamos que la aplicación haya redirigido a la ruta protegida '/editor'
    expect(mockNavigate).toHaveBeenCalledWith("/editor");
  });

  it("debe mostrar un mensaje de error si las credenciales son inválidas", async () => {
    // ==========================================
    // 1. ARRANGE (Organizar / Preparar el entorno)
    // ==========================================
    // Simulamos que el servicio rechaza la promesa con un mensaje de error
    vi.spyOn(authService, "login").mockRejectedValueOnce("Credenciales inválidas");
    const user = userEvent.setup();

    // Renderizamos el componente dentro del enrutador en memoria
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const userInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT (Actuar / Ejecutar la interacción)
    // ==========================================
    // El usuario ingresa credenciales erróneas y envía el formulario
    await user.type(userInput, "usuario_invalido");
    await user.type(passwordInput, "password_incorrecta");
    await user.click(submitButton);

    // ==========================================
    // 3. ASSERT (Afirmar / Verificar el resultado)
    // ==========================================
    // Verificamos que el servicio haya recibido los datos tipeados
    expect(authService.login).toHaveBeenCalledWith(
      "usuario_invalido",
      "password_incorrecta"
    );
    // Verificamos de forma asíncrona que el mensaje de error con role="alert" aparezca en pantalla
    const alertMessage = await screen.findByRole("alert");
    expect(alertMessage).toHaveTextContent(/credenciales inválidas/i);
    // Verificamos que NO se haya intentado navegar ni redirigir a otra página
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
