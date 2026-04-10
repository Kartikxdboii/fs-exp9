import { useState } from "react";

/*
  Part (b) — Dockerfile for React Frontend (Nginx)
  Shows how to build a React app and serve it via Nginx.
  Also shows running frontend and backend containers separately.
*/

// React app Dockerfile
const dockerfileCode = `# ---------- Stage 1: Build React App ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy built files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;

// Nginx config
const nginxConfig = `server {
    listen 80;
    server_name localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to the backend container
    location /api/ {
        proxy_pass http://backend:8080;
    }
}`;

// Project structure
const projectStructure = `react-app/
├── src/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── nginx.conf      ← Nginx config
├── Dockerfile       ← this file
└── .dockerignore`;

// Docker ignore content
const dockerIgnore = `node_modules
dist
.git
.gitignore
README.md
.env`;

// Commands to run both containers
const runCommands = [
  { cmd: "docker build -t my-frontend .", desc: "Build the frontend image", cwd: "react-app/" },
  { cmd: "docker build -t my-backend .", desc: "Build the backend image", cwd: "spring-boot-app/" },
  { cmd: "docker network create myapp-net", desc: "Create a shared Docker network" },
  { cmd: "docker run -d --name backend --network myapp-net -p 8080:8080 my-backend", desc: "Run backend on the network" },
  { cmd: "docker run -d --name frontend --network myapp-net -p 3000:80 my-frontend", desc: "Run frontend on the network" },
];

// Terminal simulation
const terminalLines = [
  { type: "prompt", text: "$ docker build -t my-frontend ." },
  { type: "output", text: "[1/6] FROM node:18-alpine AS build" },
  { type: "output", text: "[2/6] COPY package.json package-lock.json ./" },
  { type: "output", text: "[3/6] RUN npm install" },
  { type: "output", text: "[4/6] COPY . ." },
  { type: "output", text: "[5/6] RUN npm run build" },
  { type: "success", text: "Successfully tagged my-frontend:latest" },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker network create myapp-net" },
  { type: "success", text: "a3f8e2c1d9b7..." },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker run -d --name backend --network myapp-net -p 8080:8080 my-backend" },
  { type: "success", text: "b4c9d2e8f1a3..." },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker run -d --name frontend --network myapp-net -p 3000:80 my-frontend" },
  { type: "success", text: "e7f1a2b5c8d4..." },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker ps" },
  { type: "output", text: "CONTAINER ID   IMAGE          STATUS       PORTS" },
  { type: "output", text: "e7f1a2b5c8d4   my-frontend   Up 5 sec    0.0.0.0:3000→80" },
  { type: "output", text: "b4c9d2e8f1a3   my-backend    Up 10 sec   0.0.0.0:8080→8080" },
];

export default function FrontendDockerfile() {
  const [copied, setCopied] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [feStatus, setFeStatus] = useState("stopped");
  const [beStatus, setBeStatus] = useState("stopped");

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  function simulateRun() {
    setShowTerminal(true);
    setTerminalIndex(0);
    setBeStatus("building");
    setFeStatus("building");

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTerminalIndex(i);
      if (i === 7) setFeStatus("building");
      if (i === 12) setBeStatus("running");
      if (i >= terminalLines.length) {
        clearInterval(interval);
        setFeStatus("running");
      }
    }, 250);
  }

  return (
    <>
      {/* Explanation */}
      <div className="card">
        <h2>🌐 Part (b): Dockerfile for React Frontend</h2>
        <p className="subtitle">
          Build a production React app and serve it via Nginx, then run both containers separately
        </p>

        <div className="note note-info">
          💡 We use a <strong>multi-stage build</strong>: Node builds the app, then we copy only the 
          built files into a tiny Nginx image (~40MB).
        </div>

        <div className="code-header">
          <span className="code-label">Project Structure</span>
        </div>
        <div className="code-block">{projectStructure}</div>
      </div>

      {/* Dockerfile */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">📄 Dockerfile</span>
          <button
            className={`btn-copy ${copied === "dockerfile" ? "copied" : ""}`}
            onClick={() => copyToClipboard(dockerfileCode, "dockerfile")}
          >
            {copied === "dockerfile" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">
          {dockerfileCode.split("\n").map((line, i) => {
            if (line.startsWith("#")) return <div key={i}><span className="comment">{line}</span></div>;
            if (line.startsWith("FROM")) return <div key={i}><span className="instruction">FROM</span>{line.slice(4)}</div>;
            if (line.startsWith("WORKDIR")) return <div key={i}><span className="instruction">WORKDIR</span>{line.slice(7)}</div>;
            if (line.startsWith("COPY")) return <div key={i}><span className="instruction">COPY</span>{line.slice(4)}</div>;
            if (line.startsWith("RUN")) return <div key={i}><span className="instruction">RUN</span>{line.slice(3)}</div>;
            if (line.startsWith("EXPOSE")) return <div key={i}><span className="instruction">EXPOSE</span><span className="value">{line.slice(6)}</span></div>;
            if (line.startsWith("CMD")) return <div key={i}><span className="instruction">CMD</span><span className="string">{line.slice(3)}</span></div>;
            return <div key={i}>{line}</div>;
          })}
        </div>
      </div>

      {/* Nginx Config */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">⚙️ nginx.conf</span>
          <button
            className={`btn-copy ${copied === "nginx" ? "copied" : ""}`}
            onClick={() => copyToClipboard(nginxConfig, "nginx")}
          >
            {copied === "nginx" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">
          {nginxConfig.split("\n").map((line, i) => {
            if (line.trim().startsWith("#")) return <div key={i}><span className="comment">{line}</span></div>;
            if (line.includes("listen") || line.includes("server_name") || line.includes("root") || line.includes("index") || line.includes("try_files") || line.includes("proxy_pass"))
              return <div key={i}><span className="keyword">{line}</span></div>;
            if (line.includes("location") || line.includes("server"))
              return <div key={i}><span className="instruction">{line}</span></div>;
            return <div key={i}>{line}</div>;
          })}
        </div>
      </div>

      {/* .dockerignore */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">🚫 .dockerignore</span>
          <button
            className={`btn-copy ${copied === "ignore" ? "copied" : ""}`}
            onClick={() => copyToClipboard(dockerIgnore, "ignore")}
          >
            {copied === "ignore" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">{dockerIgnore}</div>
        <div className="note note-warning mt-10">
          ⚠️ Always add <strong>node_modules</strong> to .dockerignore — copying it wastes time and space!
        </div>
      </div>

      {/* Run Commands */}
      <div className="card">
        <h2>🚀 Run Both Containers Separately</h2>
        <p className="subtitle">Build images, create a shared network, and run each container</p>

        <ul className="step-list">
          {runCommands.map((item, i) => (
            <li key={i}>
              <strong>{item.desc}</strong>
              {item.cwd && <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}> (from {item.cwd})</span>}
              <div className="code-block" style={{ marginTop: 6 }}>
                <span className="prompt">$ </span>{item.cmd}
              </div>
            </li>
          ))}
        </ul>

        <button className="btn btn-primary mt-16" onClick={simulateRun}>
          ▶ Simulate Build & Run Both Containers
        </button>
      </div>

      {/* Container Status */}
      <div className="card">
        <h2>📦 Container Status</h2>
        <div className="container-grid">
          <div className={`docker-container ${feStatus}`}>
            <div className="container-icon">🌐</div>
            <div className="container-name">frontend</div>
            <span className={`container-status ${feStatus}`}>
              {feStatus === "stopped" && "⬤ Stopped"}
              {feStatus === "building" && "⬤ Building..."}
              {feStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 3000 → 80</div>
          </div>
          <div className={`docker-container ${beStatus}`}>
            <div className="container-icon">☕</div>
            <div className="container-name">backend</div>
            <span className={`container-status ${beStatus}`}>
              {beStatus === "stopped" && "⬤ Stopped"}
              {beStatus === "building" && "⬤ Building..."}
              {beStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 8080 → 8080</div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      {showTerminal && (
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">Terminal — running containers separately</span>
          </div>
          <div className="terminal-body">
            {terminalLines.slice(0, terminalIndex + 1).map((line, i) => (
              <div key={i} className={line.type}>{line.text}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
