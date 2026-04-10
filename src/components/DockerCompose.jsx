import { useState } from "react";

/*
  Part (c) — Docker Compose for Full Stack
  Shows how to run frontend, backend, and database together
  with proper networking and environment variables.
*/

// Docker Compose file
const composeCode = `version: "3.8"

services:
  # ---------- MySQL Database ----------
  db:
    image: mysql:8
    container_name: myapp-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: myappdb
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass123
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - myapp-network

  # ---------- Spring Boot Backend ----------
  backend:
    build: ./backend
    container_name: myapp-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/myappdb
      SPRING_DATASOURCE_USERNAME: appuser
      SPRING_DATASOURCE_PASSWORD: apppass123
    depends_on:
      - db
    networks:
      - myapp-network

  # ---------- React Frontend ----------
  frontend:
    build: ./frontend
    container_name: myapp-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - myapp-network

# Shared network so containers can talk to each other
networks:
  myapp-network:
    driver: bridge

# Named volume to persist database data
volumes:
  db-data:`;

// Folder structure
const folderStructure = `fullstack-docker-app/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
└── docker-compose.yml   ← this file`;

// Backend application.properties
const appProperties = `# application.properties (Spring Boot)
# These values come from Docker Compose environment variables

spring.datasource.url=\${SPRING_DATASOURCE_URL}
spring.datasource.username=\${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true`;

// Docker compose commands
const composeCommands = [
  { cmd: "docker-compose up --build", desc: "Build and start all 3 containers" },
  { cmd: "docker-compose ps", desc: "Check status of all containers" },
  { cmd: "docker-compose logs backend", desc: "View backend logs" },
  { cmd: "docker-compose down", desc: "Stop and remove all containers" },
];

// Terminal simulation
const terminalLines = [
  { type: "prompt", text: "$ docker-compose up --build" },
  { type: "warn", text: "Creating network myapp-network..." },
  { type: "warn", text: "Creating volume db-data..." },
  { type: "output", text: "" },
  { type: "output", text: "Building db..." },
  { type: "output", text: "Pulling mysql:8..." },
  { type: "success", text: "[db] MySQL ready for connections on port 3306" },
  { type: "output", text: "" },
  { type: "output", text: "Building backend..." },
  { type: "output", text: "[backend] Running mvn clean package..." },
  { type: "output", text: "[backend] BUILD SUCCESS" },
  { type: "success", text: "[backend] Started DemoApplication on port 8080" },
  { type: "success", text: "[backend] Connected to MySQL (myappdb)" },
  { type: "output", text: "" },
  { type: "output", text: "Building frontend..." },
  { type: "output", text: "[frontend] Running npm run build..." },
  { type: "output", text: "[frontend] Build completed successfully" },
  { type: "success", text: "[frontend] Nginx serving on port 80" },
  { type: "output", text: "" },
  { type: "success", text: "✓ All 3 containers are running!" },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker-compose ps" },
  { type: "output", text: "NAME              IMAGE          STATUS         PORTS" },
  { type: "output", text: "myapp-db         mysql:8        Up 30 sec      3306→3306" },
  { type: "output", text: "myapp-backend    backend        Up 20 sec      8080→8080" },
  { type: "output", text: "myapp-frontend   frontend       Up 10 sec      3000→80" },
];

export default function DockerCompose() {
  const [copied, setCopied] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [dbStatus, setDbStatus] = useState("stopped");
  const [beStatus, setBeStatus] = useState("stopped");
  const [feStatus, setFeStatus] = useState("stopped");

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  function simulateCompose() {
    setShowTerminal(true);
    setTerminalIndex(0);
    setDbStatus("building");
    setBeStatus("building");
    setFeStatus("building");

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTerminalIndex(i);
      if (i === 6) setDbStatus("running");
      if (i === 12) setBeStatus("running");
      if (i === 17) setFeStatus("running");
      if (i >= terminalLines.length) {
        clearInterval(interval);
      }
    }, 300);
  }

  return (
    <>
      {/* Explanation */}
      <div className="card">
        <h2>🐙 Part (c): Docker Compose — Full Stack</h2>
        <p className="subtitle">
          Run frontend, backend, and database containers together with proper networking
        </p>

        <div className="note note-info">
          💡 <strong>Docker Compose</strong> lets you define all services in one YAML file and start 
          everything with a single command — no need to manage networks manually!
        </div>

        {/* Architecture Diagram */}
        <h3 className="mt-16 mb-10" style={{ fontSize: "0.9rem" }}>🏗️ Architecture</h3>
        <div className="arch-diagram">
          <div className="arch-box">
            <div className="icon">🌐</div>
            <div className="label">Frontend</div>
            <div className="port">:3000 → Nginx</div>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-box">
            <div className="icon">☕</div>
            <div className="label">Backend</div>
            <div className="port">:8080 → Spring Boot</div>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-box">
            <div className="icon">🗄️</div>
            <div className="label">Database</div>
            <div className="port">:3306 → MySQL</div>
          </div>
        </div>

        <div className="code-header mt-16">
          <span className="code-label">Folder Structure</span>
        </div>
        <div className="code-block">{folderStructure}</div>
      </div>

      {/* Docker Compose File */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">📄 docker-compose.yml</span>
          <button
            className={`btn-copy ${copied === "compose" ? "copied" : ""}`}
            onClick={() => copyToClipboard(composeCode, "compose")}
          >
            {copied === "compose" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">
          {composeCode.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("#")) return <div key={i}><span className="comment">{line}</span></div>;
            if (trimmed.startsWith("-") && trimmed.includes('"')) return <div key={i}>{line.split('"').map((part, j) => j % 2 === 1 ? <span key={j} className="string">"{part}"</span> : part)}</div>;
            if (trimmed.match(/^(version|services|networks|volumes):/)) return <div key={i}><span className="instruction">{line}</span></div>;
            if (trimmed.match(/^(db|backend|frontend|myapp-network|db-data):/)) return <div key={i}><span className="keyword">{line}</span></div>;
            if (trimmed.match(/^(image|container_name|restart|build|driver|ports|environment|depends_on|volumes):/)) return <div key={i}>{line.replace(trimmed.split(":")[0], "")}<span className="variable">{trimmed.split(":")[0]}</span>:{line.split(":").slice(1).join(":")?.includes(":") ? line.split(":").slice(1).join(":") : ""}{trimmed.split(":")[1] ? <span className="value"> {trimmed.split(":").slice(1).join(":").trim()}</span> : ""}</div>;
            if (trimmed.includes(":") && !trimmed.startsWith("-")) {
              const key = trimmed.split(":")[0];
              const val = trimmed.split(":").slice(1).join(":").trim();
              return <div key={i}>{line.replace(trimmed, "")}<span className="variable">{key}</span>: <span className="value">{val}</span></div>;
            }
            return <div key={i}>{line}</div>;
          })}
        </div>
      </div>

      {/* Application Properties */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">⚙️ application.properties</span>
          <button
            className={`btn-copy ${copied === "props" ? "copied" : ""}`}
            onClick={() => copyToClipboard(appProperties, "props")}
          >
            {copied === "props" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">
          {appProperties.split("\n").map((line, i) => {
            if (line.startsWith("#")) return <div key={i}><span className="comment">{line}</span></div>;
            if (line.includes("=")) {
              const [k, v] = [line.split("=")[0], line.split("=").slice(1).join("=")];
              return <div key={i}><span className="variable">{k}</span>=<span className="value">{v}</span></div>;
            }
            return <div key={i}>{line}</div>;
          })}
        </div>
        <div className="note note-warning mt-10">
          ⚠️ The <code>$&#123;SPRING_DATASOURCE_URL&#125;</code> values are injected by Docker Compose 
          from the <strong>environment</strong> section — you don't hardcode them!
        </div>
      </div>

      {/* Commands */}
      <div className="card">
        <h2>⚡ Docker Compose Commands</h2>
        <p className="subtitle">One command to rule them all!</p>

        <ul className="step-list">
          {composeCommands.map((item, i) => (
            <li key={i}>
              <strong>{item.desc}</strong>
              <div className="code-block" style={{ marginTop: 6 }}>
                <span className="prompt">$ </span>{item.cmd}
              </div>
            </li>
          ))}
        </ul>

        <button className="btn btn-primary mt-16" onClick={simulateCompose}>
          ▶ Simulate docker-compose up
        </button>
      </div>

      {/* Container Status */}
      <div className="card">
        <h2>📦 All Container Status</h2>
        <div className="container-grid">
          <div className={`docker-container ${feStatus}`}>
            <div className="container-icon">🌐</div>
            <div className="container-name">myapp-frontend</div>
            <span className={`container-status ${feStatus}`}>
              {feStatus === "stopped" && "⬤ Stopped"}
              {feStatus === "building" && "⬤ Building..."}
              {feStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 3000 → 80</div>
          </div>
          <div className={`docker-container ${beStatus}`}>
            <div className="container-icon">☕</div>
            <div className="container-name">myapp-backend</div>
            <span className={`container-status ${beStatus}`}>
              {beStatus === "stopped" && "⬤ Stopped"}
              {beStatus === "building" && "⬤ Building..."}
              {beStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 8080 → 8080</div>
          </div>
          <div className={`docker-container ${dbStatus}`}>
            <div className="container-icon">🗄️</div>
            <div className="container-name">myapp-db</div>
            <span className={`container-status ${dbStatus}`}>
              {dbStatus === "stopped" && "⬤ Stopped"}
              {dbStatus === "building" && "⬤ Pulling..."}
              {dbStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 3306 → 3306</div>
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
            <span className="terminal-title">Terminal — docker-compose up --build</span>
          </div>
          <div className="terminal-body">
            {terminalLines.slice(0, terminalIndex + 1).map((line, i) => (
              <div key={i} className={line.type}>{line.text}</div>
            ))}
          </div>
        </div>
      )}

      {/* Verify */}
      <div className="card">
        <h2>✅ Verify via Browser</h2>
        <p className="subtitle">Open these URLs to check everything works</p>
        <ul className="step-list">
          <li>
            <strong>Frontend:</strong> Open{" "}
            <span style={{ color: "var(--primary)" }}>http://localhost:3000</span> — 
            see the React app served by Nginx
          </li>
          <li>
            <strong>Backend API:</strong> Open{" "}
            <span style={{ color: "var(--primary)" }}>http://localhost:8080/api/hello</span> — 
            see the Spring Boot response
          </li>
          <li>
            <strong>Full flow:</strong> The React app calls /api/hello → 
            Nginx proxies to backend → backend queries MySQL → response displayed
          </li>
        </ul>
        <div className="note note-success mt-16">
          ✅ If all 3 steps show correct responses, your full-stack Docker setup is working!
        </div>
      </div>
    </>
  );
}
