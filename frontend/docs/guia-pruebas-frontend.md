# Guía de Pruebas del Frontend — FACEA Landing Page

Esta guía documenta la arquitectura, estrategia y ejecución de la batería de pruebas automatizadas del frontend. Explica los niveles de prueba implementados, qué cubren, cómo ejecutarlas y la trazabilidad paso a paso desde el código de test hasta el código de producción.

---

## Tabla de Contenidos
1. [Pirámide y Estrategia de Testing](#1-pirámide-y-estrategia-de-testing)
2. [Inventario de Pruebas](#2-inventario-de-pruebas)
3. [Cómo Ejecutar las Pruebas](#3-cómo-ejecutar-las-pruebas)
4. [Trazabilidad: Del Test a la Implementación](#4-trazabilidad-del-test-a-la-implementación)
5. [Buenas Prácticas Aplicadas](#5-buenas-prácticas-aplicadas)

---

## 1. Pirámide y Estrategia de Testing

Para cumplir con los estándares de ingeniería y la consigna académica, el frontend cuenta con dos niveles complementarios de pruebas:

```
        / \
       /   \
      / E2E \       <-- Playwright (Navegador Chromium real, interacción visual de punta a punta)
     /-------\
    / Integ.  \     <-- Vitest + Testing Library (Componentes en memoria con jsdom, mocks de servicios)
   /-----------\
```

| Nivel | Herramienta | Entorno | Propósito | Velocidad |
| :--- | :--- | :--- | :--- | :--- |
| **Integración de Componentes** | **Vitest** + **React Testing Library** | `jsdom` (Memoria RAM) | Validar la lógica del componente, accesibilidad y estados locales sin abrir navegadores. | ~1.5 seg |
| **End-to-End (E2E) UI** | **Playwright** | Navegador real (**Chromium**) | Simular el comportamiento real de un usuario de punta a punta navegando en el sitio web. | ~7 seg |

---

## 2. Inventario de Pruebas

### A. Pruebas de Integración (`LoginPage.test.tsx`)
* **Archivo:** `src/pages/LoginPage.test.tsx`
* **Tecnologías:** Vitest, React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`.
* **Casos cubiertos:**
  1. **Flujo de login exitoso:** Ingreso de credenciales de administrador válidas (`admin` / `123`), disparo del evento de submit, invocación correcta del servicio y navegación programática a `/editor`.
  2. **Flujo de credenciales inválidas:** Ingreso de datos erróneos, captura del rechazo de la promesa del servicio, renderizado del mensaje de error con rol accesible `role="alert"` y verificación de permanencia en `/login`.

---

### B. Pruebas End-to-End (`e2e/login.spec.ts`)
* **Archivo:** `e2e/login.spec.ts`
* **Tecnología:** Playwright Test.
* **Casos cubiertos:**
  1. **Aislamiento de red (`beforeEach`):** Intercepción de rutas `**/api/**` para mockear respuestas HTTP en el navegador. La prueba es autónoma y no requiere que el backend esté encendido.
  2. **Navegación e inicio de sesión en navegador real:** Carga de `http://localhost:5173/login`, tipeo con teclado virtual, click de mouse en el botón, espera reactiva a la redirección a `/editor` y comprobación de visibilidad de los controles del panel de edición (botón *"Publicar"*).
  3. **Comportamiento ante credenciales incorrectas en navegador:** Llenado de credenciales inválidas y verificación visual del mensaje de alerta emergente sin redirección.

---

## 3. Cómo Ejecutar las Pruebas

Todos los comandos se ejecutan desde la carpeta raíz del frontend (`cd frontend`):

### 1. Ejecutar Pruebas de Integración (Vitest)
```bash
# Modo ejecución única (ideal para entrega o CI)
npm test

# Modo interactivo (Watch mode para desarrollo)
npx vitest
```

### 2. Ejecutar Pruebas End-to-End (Playwright)
```bash
# Modo headless (por consola, rápido)
npm run test:e2e

# Modo interfaz gráfica interactiva (UI Mode con Time-Travel Debugger)
npm run test:e2e:ui

# Modo headed (viendo la ventana del navegador abrirse en pantalla)
npx playwright test --headed
```

### 3. Verificación de Calidad de Código
```bash
# Verificación de linter (debe dar 0 errores y 0 warnings)
npm run lint

# Verificación de compilación TypeScript y empaquetado Vite
npm run build
```

---

## 4. Trazabilidad: Del Test a la Implementación

Para entender cómo se conectan las pruebas con el código de producción, sigamos el recorrido del flujo de login:

```
[ Test ] ---> [ Vista/Página ] ---> [ Componentes UI ] ---> [ Servicio ]
```

### Paso 1: El Test prepara la interacción (Arrange)
* **En el test (`LoginPage.test.tsx` / `login.spec.ts`):**
  Se busca el campo de usuario mediante accesibilidad:
  ```typescript
  const userInput = screen.getByLabelText(/usuario/i);
  ```
* **En la implementación (`src/pages/LoginPage.tsx`):**
  Para que el test encuentre el input de manera accesible, el `<label>` está vinculado con el `<input>` mediante `htmlFor` e `id`:
  ```tsx
  <label htmlFor="username">Usuario</label>
  <input id="username" type="text" ... />
  ```

---

### Paso 2: El Test ejecuta la acción (Act)
* **En el test:**
  El usuario tipea los datos y presiona el botón:
  ```typescript
  await user.type(userInput, "admin");
  await user.type(passwordInput, "123");
  await user.click(submitButton);
  ```
* **En la implementación:**
  El formulario escucha el evento `onSubmit`:
  ```tsx
  <form onSubmit={handleLogin}>
    ...
    <Button type="submit" disabled={loading}>
  </form>
  ```
  La función `handleLogin` activa el estado `loading = true`, deshabilitando los inputs para evitar envíos dobles.

---

### Paso 3: El Código de Producción llama a la capa de Servicio
* **En la implementación (`src/pages/LoginPage.tsx`):**
  ```typescript
  const success = await authService.login(username, password);
  if (success) navigate("/editor");
  ```
* **En el servicio (`src/services/authService.ts`):**
  Valida las credenciales y guarda el flag en `localStorage`:
  ```typescript
  if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
    localStorage.setItem("isAuthenticated", "true");
    resolve(true);
  }
  ```

---

### Paso 4: El Test verifica el resultado (Assert)
* **En el test de integración (`LoginPage.test.tsx`):**
  Verifica que el servicio haya recibido los datos y que `useNavigate` haya solicitado viajar a `/editor`:
  ```typescript
  expect(authService.login).toHaveBeenCalledWith("admin", "123");
  expect(mockNavigate).toHaveBeenCalledWith("/editor");
  ```
* **En el test E2E (`e2e/login.spec.ts`):**
  El navegador real cambia de página y se comprueba que el editor exista en el DOM:
  ```typescript
  await expect(page).toHaveURL(/.*\/editor/);
  await expect(page.getByRole("button", { name: /publicar/i })).toBeVisible();
  ```

---

### Paso 5: En caso de error (Manejo de Excepciones)
* **En la implementación (`src/pages/LoginPage.tsx`):**
  El bloque `catch` discrimina tipos de forma segura con `err: unknown`:
  ```typescript
  } catch (err: unknown) {
    if (err instanceof Error) setError(err.message);
    else if (typeof err === "string") setError(err);
    else setError("Ocurrió un error inesperado al iniciar sesión.");
  }
  ```
  Y renderiza el mensaje accesible:
  ```tsx
  {error && <p role="alert">{error}</p>}
  ```
* **En los tests:**
  Se comprueba que el elemento con rol `alert` esté presente y visible:
  ```typescript
  // Vitest
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/credenciales inválidas/i);

  // Playwright
  await expect(page.getByRole("alert")).toHaveText(/credenciales inválidas/i);
  ```

---

## 5. Buenas Prácticas Aplicadas

1. **Patrón AAA (Arrange, Act, Assert):** Cada prueba está explícitamente dividida en las tres fases canónicas de testing.
2. **Consultas orientadas a accesibilidad (A11y-First):** No se utilizan selectores frágiles como clases CSS o IDs de testing artificiales (`data-testid`). Se busca por texto accesible (`getByLabelText`, `getByRole`), garantizando que la aplicación sea utilizable por lectores de pantalla.
3. **Mocks de red deterministas:** En Playwright se usa `page.route` para no acoplar la ejecución del test frontend al estado del servidor backend.
4. **Aislamiento de runners:** `vitest.config.ts` excluye explícitamente el directorio `e2e/` para que Vitest no intente ejecutar los tests de Playwright, evitando conflictos entre suites.
5. **Tipado seguro:** Configuración estricta en TypeScript con soporte para globals de test sin colisiones de empaquetado en Vite 8.
