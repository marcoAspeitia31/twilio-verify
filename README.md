# 📲 Microservicio de Verificación SMS con Twilio

Este proyecto es una API REST construida en Node.js que permite verificar números telefónicos mediante SMS usando Twilio Verify. Incluye autenticación básica, soporte para CORS y está listo para ser desplegado en Docker.

---

## 📦 Requisitos

- Node.js 18 o superior
- Docker y Docker Compose
- Cuenta Twilio con servicio Verify
- [Trivy (opcional)](https://aquasecurity.github.io/trivy/) para escaneo de seguridad
- Carpeta `logs/` creada con permisos (el sistema lo crea si no existe)
- Apps móviles cliente (Flutter, Apphive, etc.)

---

## 🧱 Estructura del Proyecto

```
.
├── docs/api.http             # Ejemplos de peticiones
├── logs/                     # Logs rotados por Winston
├── src/
│   ├── controllers/          # Manejo de req/res
│   ├── services/             # Lógica Twilio y reglas de negocio
│   ├── routes/               # Rutas Express
│   ├── middlewares/          # CORS y auth
│   ├── utils/                # Logger, sanitización, errores Twilio
│   └── app.js
├── .dockerignore
├── .env.example / .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
├── README.md
└── run.sh / restart.sh / stop.sh / scan.sh
```

---

## 🔧 Configuración de Variables de entorno

1. Clona el repositorio y copia el archivo `.env.example` a `.env`.

```bash
cp .env.example .env
```

2. Completa las variables en el archivo `.env`:

```env
PORT=3000

# Credenciales de Twilio
TWILIO_ACCOUNT_SID=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Autenticación básica para proteger la API
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=supersecurepassword

# Orígenes permitidos para CORS (puedes dejar "*" si solo será consumido por app móvil)
CORS_ORIGINS=*
```

> 🔐 **Importante**: El `TWILIO_VERIFY_SERVICE_SID` debe obtenerse desde [https://www.twilio.com/console/verify/services](https://www.twilio.com/console/verify/services). No es necesario especificar un número telefónico (`from`) ya que Twilio lo gestiona automáticamente a través del servicio Verify.

---


## 🐳 Uso con Docker

### 🚀 Levantar en desarrollo

```bash
./run.sh
```

### 🔁 Reiniciar (por cambios en código)

```bash
./restart.sh
```
> 🛡️  `restart.sh` ejecuta automáticamente `scan.sh` para detectar vulnerabilidades en la imagen antes de reconstruir.

Este script:
- Detiene el contenedor.
- Reconstruye la imagen.
- Escanea la imagen con **Trivy** (si está instalado).
- Levanta el contenedor.

### 🛑 Detener contenedor

```bash
./stop.sh
```

### 🔍 Escanear vulnerabilidades (requiere docker scan y Trivy)

```bash
./scan.sh
```

---

## 📥 Actualizar microservicio en VPS

1. **Conectarse por SSH**
2. **Detener contenedor**
   ```bash
   ./stop.sh
   ```
3. **Obtener última versión del código**
   ```bash
   git pull origin main  # o la rama correspondiente
   ```
4. **Reiniciar con Docker**
   ```bash
   ./restart.sh
   ```
## 🧹 Mantenimiento y depuración de Docker

En ocasiones, al reconstruir la imagen o liberar espacio en disco, puede ser útil limpiar recursos no utilizados de Docker.

### Limpiar Docker por completo

> ⚠️ **Advertencia:** Este comando eliminará todas las imágenes, contenedores detenidos, redes no utilizadas y caché de volúmenes.

```bash
docker system prune -a
```
---

## 📄 Consultar logs

### En consola:

```bash
docker logs -f twilio-verify
```

### En archivo:

```bash
cat logs/app-YYYY-MM-DD.log
```

Los logs se almacenan en `logs/` y se rotan diariamente:

- `backend-YYYY-MM-DD.log`: logs generales (info, warn, error)
- `error.log`: errores críticos acumulados

> Winston crea automáticamente los archivos con compresión `.gz` para logs antiguos.


---

## 🧰 Ejecutar con NPM (Uso sin Docker)

Si no deseas usar Docker, puedes correr el proyecto localmente con Node.js:

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear archivo `.env`

Basado en `.env.example`, agrega tus variables.

### 3. Ejecutar el servidor

```bash
npm start
```

> Asegúrate de que el puerto `3000` esté libre o cámbialo en `.env`

---

## 📡 Endpoints disponibles

Todos los endpoints requieren **autenticación básica** (`AUTH_USER` / `AUTH_PASS`).

| Método | Ruta                        | Descripción                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/verify/send-code`     | Enviar SMS de verificación     |
| POST   | `/api/verify/verify-code`   | Verificar código recibido      |


### `POST /api/verify/send-code`

Envía un código SMS al número proporcionado.

**Headers:**
- `Authorization: Basic` con usuario y contraseña definidos en `.env`

**Body:**
```json
{
  "phoneNumber": "+521XXXXXXXXXX"
}
```

---

### `POST /api/verify/verify-code`

Verifica el código recibido.

**Headers:**
- `Authorization: Basic` con usuario y contraseña definidos en `.env`

**Body:**
```json
{
  "phoneNumber": "+521XXXXXXXXXX",
  "code": "123456"
}
```

---

## 🔐 Seguridad

- CORS configurado por dominios permitidos desde `.env`
- Middleware de autenticación HTTP Basic
- Logger con rotación por día y tamaño

---

## 🧪 Ejemplo de peticiones HTTP

Puedes probarlo desde `docs/api.http` con VS Code (REST Client) o desde Postman.

### Enviar código:

```http
POST http://localhost:3000//api/verify/send-code
Authorization: Basic base64userpass
Content-Type: application/json

{
  "phoneNumber": "+521722XXXXXXX"
}
```

### Verificar código:

```http
POST http://localhost:3000//api/verify/verify-code
Authorization: Basic base64userpass
Content-Type: application/json

{
  "phoneNumber": "+521722XXXXXXX",
  "code": "123456"
}
```


> 🧠 Puedes convertir el usuario y contraseña de autenticación básica con:  
> `echo -n 'admin:supersecurepassword' | base64`

---

## ✅ Recomendaciones

- Usar `CORS_ORIGINS=*` si tu app móvil (por ejemplo, hecha en Apphive) consume la API directamente.
- No subas el archivo `.env` a Git.
- Asegura el acceso a la API usando HTTPS y autenticación básica.

---

## 👤 Autor

Marco Aspeitia  
Desarrollador Backend – CIDEAPPS

---

## 📄 Licencia

MIT License
