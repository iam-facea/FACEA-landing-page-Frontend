# 🎭 Suite de Pruebas End-to-End Externa (Black-Box Testing)

Esta carpeta contiene la batería de pruebas **End-to-End (E2E) desacoplada** para la landing page de FACEA.
Sigue el principio de **caja negra**: las pruebas no dependen del código fuente del frontend ni del backend, sino que interactúan con la aplicación como un cliente web externo.

---

## 🚀 Requisitos Previos

Tener la aplicación web levantada y accesible en tu máquina local.

En una terminal independiente:
```bash
cd frontend
npm run dev
# La aplicación queda escuchando en http://localhost:5173
```

---

## 🧪 Cómo ejecutar las pruebas E2E desde afuera

En **otra terminal**, posicionate en esta carpeta:
```bash
cd e2e-tests
```

### 1. Ejecución estándar por consola (Headless)
```bash
npm test
```

### 2. Ejecución con interfaz visual e interactiva (UI Mode)
Permite inspeccionar la navegación paso a paso con el Time-Travel Debugger de Playwright:
```bash
npm run test:ui
```

### 3. Ejecución viendo el navegador abrirse en pantalla (Headed)
```bash
npm run test:headed
```

---

## ⚙️ Configuración y Variables de Entorno

Por defecto, los tests apuntan a `http://localhost:5173`.
Si la aplicación se despliega en otro puerto o en un servidor de testing externo, se puede especificar con la variable `BASE_URL`:

```bash
BASE_URL=http://mi-servidor-staging:8080 npm test
```
