import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { authService } from "../services/authService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Flujo de Login en LoginPage (Supabase Auth)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos que por defecto no hay sesión previa
    vi.spyOn(authService, "isAuthenticated").mockResolvedValue(false);
  });

  it("debe iniciar sesión con credenciales válidas y navegar al panel del editor", async () => {
    // ==========================================
    // 1. ARRANGE
    // ==========================================
    vi.spyOn(authService, "login").mockResolvedValueOnce(true);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const userInput = screen.getByLabelText(/email \/ usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await user.type(userInput, "editor@institucion.edu.ar");
    await user.type(passwordInput, "password_segura");
    await user.click(submitButton);

    // ==========================================
    // 3. ASSERT
    // ==========================================
    expect(authService.login).toHaveBeenCalledWith(
      "editor@institucion.edu.ar",
      "password_segura",
    );
    expect(mockNavigate).toHaveBeenCalledWith("/editor");
  });

  it("debe mostrar un mensaje de error si las credenciales son inválidas", async () => {
    // ==========================================
    // 1. ARRANGE
    // ==========================================
    vi.spyOn(authService, "login").mockRejectedValueOnce("Credenciales inválidas");
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const userInput = screen.getByLabelText(/email \/ usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await user.type(userInput, "erroneo@test.com");
    await user.type(passwordInput, "wrong_pass");
    await user.click(submitButton);

    // ==========================================
    // 3. ASSERT
    // ==========================================
    expect(authService.login).toHaveBeenCalledWith("erroneo@test.com", "wrong_pass");
    const alertMessage = await screen.findByRole("alert");
    expect(alertMessage).toHaveTextContent(/credenciales inválidas/i);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("debe mostrar mensaje de acceso denegado si el usuario no tiene rol editor (403)", async () => {
    // ==========================================
    // 1. ARRANGE (Simulamos rechazo de autorización 403)
    // ==========================================
    vi.spyOn(authService, "login").mockRejectedValueOnce(
      "Acceso denegado: tu usuario no tiene permisos de edición",
    );
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const userInput = screen.getByLabelText(/email \/ usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // ==========================================
    // 2. ACT
    // ==========================================
    await user.type(userInput, "otro_usuario@institucion.edu.ar");
    await user.type(passwordInput, "pass_valida_pero_sin_permiso");
    await user.click(submitButton);

    // ==========================================
    // 3. ASSERT
    // ==========================================
    const alertMessage = await screen.findByRole("alert");
    expect(alertMessage).toHaveTextContent(/no tiene permisos de edición/i);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
