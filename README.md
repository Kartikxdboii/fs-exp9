# Experiment 9 — Docker & Docker Compose

Containerize and run a complete full-stack application using Docker and Docker Compose.

## Project Structure

```
exp9/
├── backend/
│   └── Dockerfile          ← Part (a): Spring Boot backend
├── frontend/
│   ├── Dockerfile          ← Part (b): React frontend (Nginx)
│   └── nginx.conf
├── docker-compose.yml      ← Part (c): Full stack compose
└── index.html              ← Documentation page
```

## Parts

- **(a)** Dockerfile for Spring Boot backend — multi-stage build (Maven → JRE)
- **(b)** Dockerfile for React frontend — production build served by Nginx
- **(c)** Docker Compose — run frontend, backend, and MySQL together

## Quick Start

```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/hello
