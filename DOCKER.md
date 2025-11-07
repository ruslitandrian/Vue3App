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
- Build stage: Node 18 Alpine installs dependencies with `npm ci` and runs `npm run build` to emit `dist/` assets.
- Runtime stage: Nginx 1.27 Alpine serves static files from `/usr/share/nginx/html`.
- `nginx.conf` enables SPA routing with `try_files $uri $uri/ /index.html;` **and** proxies `/api/` traffic to `http://52.194.223.195:8000` by default.
- Update the upstream host in `nginx.conf` before deploying if your backend lives elsewhere.

## Common Customizations
- Change host port (e.g., 3000):
  - Docker: `-p 3000:80`
  - Compose: edit `docker-compose.yml` → `ports: ["3000:80"]`
- Static asset caching headers are set in `nginx.conf`. Adjust as needed.
- API proxy settings live in `nginx.conf`; change `proxy_pass` to match your backend service.

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


