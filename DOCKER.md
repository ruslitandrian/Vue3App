# Docker Guide

This project ships with a production-ready multi-stage Dockerfile (Vite build + Nginx serve) and a docker-compose configuration.

## Prerequisites
- Docker 20.10+
- Docker Compose v2+

## 1) Build and Run with Docker

### Build the image
```bash
docker build -t vue3-app .
```

### Run the container (map to localhost:8080)
```bash
docker run --rm -p 8080:80 --name vue3-app vue3-app
```

Open: `http://localhost:8080`

### Stop the container
```bash
docker stop vue3-app
```

## 2) Build and Run with Docker Compose

### Start in background
```bash
docker compose up -d
```

### Check service status
```bash
docker compose ps
```

### View logs
```bash
docker compose logs -f
```

### Stop and remove
```bash
docker compose down
```

## Image Contents
- Build stage: Node 18 Alpine builds Vite assets to `dist/` using `npm ci` and `npm run build`.
- Runtime stage: Nginx 1.27 Alpine serves static files from `/usr/share/nginx/html`.
- SPA routing enabled via `nginx.conf` using `try_files $uri $uri/ /index.html;`.

## Common Customizations
- Change host port (e.g., 3000):
  - Docker: `-p 3000:80`
  - Compose: edit `docker-compose.yml` → `ports: ["3000:80"]`
- Static asset caching headers are set in `nginx.conf`. Adjust as needed.

## Development vs Production
- This image is optimized for production (static build + Nginx).
- For local dev with hot reload, prefer running Vite directly: `npm run dev`.

## Troubleshooting
- Port already in use: change the left side of the port mapping, e.g. `-p 8081:80`.
- Stale build: rebuild the image without cache:
```bash
docker build --no-cache -t vue3-app .
```
- Permission or network issues on corporate networks: try switching Docker network or VPN settings.


