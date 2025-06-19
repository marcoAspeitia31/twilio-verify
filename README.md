# SMS Verification App

Este proyecto es una API REST construida en Node.js que permite verificar números telefónicos mediante SMS usando Twilio Verify. Incluye autenticación básica, soporte para CORS y está listo para ser desplegado en Docker.

---

## 📦 Requisitos

- Node.js 18 o superior
- Docker y Docker Compose
- Cuenta Twilio con servicio Verify
- Apps móviles cliente (Flutter, Apphive, etc.)

---

## 🔧 Configuración

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

## 🚀 Uso con Docker

```bash
docker-compose up --build
```

Esto iniciará el servidor en `http://localhost:3000`.

---

## 🛠️ Endpoints disponibles

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

## 🧪 Ejemplos de pruebas HTTP (`docs/api.http`)

Puedes usar la extensión "REST Client" en Visual Studio Code para probar estos endpoints:

```http
### Enviar código de verificación
POST https://tudominio.com/api/verify/send-code
Authorization: Basic YWRtaW46c3VwZXJzZWN1cmVwYXNzd29yZA==
Content-Type: application/json

{
  "phoneNumber": "+521XXXXXXXXXX"
}

### Verificar código recibido
POST https://tudominio.com/api/verify/verify-code
Authorization: Basic YWRtaW46c3VwZXJzZWN1cmVwYXNzd29yZA==
Content-Type: application/json

{
  "phoneNumber": "+521XXXXXXXXXX",
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

## 📄 Licencia

MIT License
