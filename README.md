# 🔐 Configuración de acceso con SSH (Recomendado)

Para trabajar de forma segura y sin tener que ingresar credenciales constantemente, utilizamos **autenticación mediante SSH**.

# ⚙️ Paso a paso: Configuración SSH

## 1. Verificar si ya tenés una clave SSH

Abrí una terminal y ejecutá:

```bash
ls ~/.ssh
```

Si ves archivos como:

```
id_ed25519
id_ed25519.pub
```

👉 Ya tenés una clave y podés usarla.

---

## 2. Generar una nueva clave (si no tenés)

```bash
ssh-keygen -t ed25519 -C "tu_email@example.com"
```

Presioná `Enter` en todas las opciones (o podés definir una passphrase si querés mayor seguridad).

---

## 3. Iniciar el agente SSH

```bash
eval "$(ssh-agent -s)"
```

Esto inicia un proceso que gestiona tus claves.

---

## 4. Agregar tu clave al agente

```bash
ssh-add ~/.ssh/id_ed25519
```

---

## 5. Copiar la clave pública

```bash
cat ~/.ssh/id_ed25519.pub
```

Copiá todo el contenido (incluyendo el final que suele ser tu email).

---

## 6. Agregar la clave en GitHub

1. Ir a **Settings**
2. Entrar en **SSH and GPG keys**
3. Click en **New SSH key**
4. Pegar la clave copiada
5. Guardar

---

## 7. Verificar conexión

```bash
ssh -T git@github.com
```

Deberías ver un mensaje como:

```
Hi <tu-usuario>! You've successfully authenticated...
```

---

## 8. Clonar el repositorio usando SSH

⚠️ Importante: usar la URL SSH, no HTTPS.

```bash
git clone git@github.com:usuario/repositorio.git
```

---

## 🔄 Si ya clonaste con HTTPS

Podés cambiar la URL del repositorio:

```bash
git remote set-url origin git@github.com:usuario/repositorio.git
```

---

# ⚠️ Notas importantes

- Cada colaborador debe tener su propia clave SSH
- No compartir claves privadas
- La clave pública sí puede compartirse (es la que se sube a GitHub)

---

# ✅ Verificación final

Podés comprobar que todo funciona con:

```bash
git pull
git push
```

Sin que te pida usuario o contraseña.

---

# 👥 Trabajo en equipo

Una vez configurado SSH, podés empezar a trabajar con el flujo de ramas definido en el proyecto (`develop`, `feature/*`, etc.).

---

# 📌 Recomendación

Si tenés problemas con SSH:

- Revisar que el agente esté activo
- Verificar que la clave esté cargada
- Confirmar que la clave esté en GitHub
