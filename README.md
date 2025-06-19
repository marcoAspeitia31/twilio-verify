# SMS Verification App

Este proyecto permite verificar números telefónicos usando Twilio y autenticación básica, con soporte para CORS. Diseñado para ser usado por apps móviles Android/iOS.

## Requisitos

- Node.js
- Docker
- Cuenta Twilio
- Docker Compose

## Configuración

Copia el archivo `.env.example` a `.env` y coloca tus credenciales reales.

## Uso

```bash
docker-compose up --build
```

### Rutas disponibles

- `POST /send-code` → Enviar código de verificación
- `POST /verify-code` → Verificar código enviado

Recuerda usar autenticación básica en cada petición.
