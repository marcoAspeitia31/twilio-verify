#!/bin/bash

echo "🔁 Reiniciando backend..."

# Paso 1: detener contenedor si existe
docker compose down

# Paso 2: construir la imagen
docker compose build

# Paso 3: escanear la imagen
echo "🔍 Escaneando imagen con Trivy..."
if ! command -v trivy &> /dev/null; then
  echo "⚠️  Trivy no está instalado. Puedes instalarlo desde: https://github.com/aquasecurity/trivy"
else
  trivy image --severity HIGH,CRITICAL twilio-verify:latest
fi

# Paso 4: levantar contenedor
docker compose up -d