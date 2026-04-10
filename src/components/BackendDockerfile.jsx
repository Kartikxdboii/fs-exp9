import { useState } from "react";

/*
  Part (a) — Dockerfile for Spring Boot Backend
  Shows how to write a multi-stage Dockerfile that builds
  the JAR using Maven and runs it in a lightweight JDK container.
*/

// The Dockerfile content for the Spring Boot backend
const dockerfileCode = `# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy pom.xml first (for caching dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the JAR file (skip tests for speed)
RUN mvn clean package -DskipTests

# ---------- Stage 2: Run ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]`;

// Simple project structure
const projectStructure = `spring-boot-app/
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java
│       │   └── HelloController.java
│       └── resources/
│           └── application.properties
├── pom.xml
└── Dockerfile   ← this file`;

// Sample Spring Boot controller
const controllerCode = `package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot in Docker!";
    }
}`;

// Docker commands to build & run
const buildCommands = [
  { cmd: "docker build -t my-backend .", desc: "Build the Docker image" },
  { cmd: "docker run -p 8080:8080 my-backend", desc: "Run the container" },
  { cmd: "docker ps", desc: "Check running containers" },
];

// Simulated terminal output lines
const terminalLines = [
  { type: "prompt", text: "$ docker build -t my-backend ." },
  { type: "output", text: "[1/7] FROM maven:3.9-eclipse-temurin-17" },
  { type: "output", text: "[2/7] WORKDIR /app" },
  { type: "output", text: "[3/7] COPY pom.xml ." },
  { type: "output", text: "[4/7] RUN mvn dependency:go-offline" },
  { type: "output", text: "[5/7] COPY src ./src" },
  { type: "output", text: "[6/7] RUN mvn clean package -DskipTests" },
  { type: "success", text: "Successfully built a1b2c3d4e5f6" },
  { type: "success", text: "Successfully tagged my-backend:latest" },
  { type: "prompt", text: "" },
  { type: "prompt", text: "$ docker run -p 8080:8080 my-backend" },
  { type: "output", text: "  .   ____          _            __ _ _" },
  { type: "output", text: " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\" },
  { type: "output", text: "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\" },
  { type: "output", text: " \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )" },
  { type: "output", text: "  '  |____| .__|_| |_|_| |_\\__, | / / / /" },
  { type: "output", text: " =========|_|==============|___/=/_/_/_/" },
  { type: "success", text: "Started DemoApplication in 2.3 seconds" },
  { type: "success", text: "Tomcat started on port 8080" },
];

export default function BackendDockerfile() {
  const [copied, setCopied] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [containerStatus, setContainerStatus] = useState("stopped");

  // Copy text to clipboard
  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  // Simulate running docker build
  function simulateBuild() {
    setShowTerminal(true);
    setTerminalIndex(0);
    setContainerStatus("building");

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTerminalIndex(i);
      if (i >= terminalLines.length) {
        clearInterval(interval);
        setContainerStatus("running");
      }
    }, 300);
  }

  return (
    <>
      {/* Explanation Card */}
      <div className="card">
        <h2>🐳 Part (a): Dockerfile for Spring Boot Backend</h2>
        <p className="subtitle">
          Write a multi-stage Dockerfile that builds the JAR and runs it inside a container
        </p>

        <div className="note note-info">
          💡 A <strong>multi-stage build</strong> keeps the final image small — we use Maven to build, 
          then copy only the JAR into a slim JRE image.
        </div>

        {/* Project Structure */}
        <div className="code-header">
          <span className="code-label">Project Structure</span>
        </div>
        <div className="code-block">{projectStructure}</div>
      </div>

      {/* Dockerfile Card */}
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
            if (line.startsWith("ENTRYPOINT")) return <div key={i}><span className="instruction">ENTRYPOINT</span><span className="string">{line.slice(10)}</span></div>;
            return <div key={i}>{line}</div>;
          })}
        </div>
      </div>

      {/* Sample Controller */}
      <div className="card">
        <div className="code-header">
          <span className="file-badge">☕ HelloController.java</span>
          <button
            className={`btn-copy ${copied === "controller" ? "copied" : ""}`}
            onClick={() => copyToClipboard(controllerCode, "controller")}
          >
            {copied === "controller" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="code-block">
          {controllerCode.split("\n").map((line, i) => {
            if (line.trim().startsWith("//")) return <div key={i}><span className="comment">{line}</span></div>;
            if (line.trim().startsWith("@")) return <div key={i}><span className="keyword">{line}</span></div>;
            if (line.trim().startsWith("import")) return <div key={i}><span className="keyword">import</span>{line.slice(6)}</div>;
            if (line.trim().startsWith("package")) return <div key={i}><span className="keyword">package</span>{line.slice(7)}</div>;
            if (line.includes("public")) return <div key={i}>{line.replace("public", "").split("public").join("")}<span className="keyword">public</span>{line.split("public").slice(1).join("public")}</div>;
            if (line.includes('"')) return <div key={i}>{line.split('"').map((part, j) => j % 2 === 1 ? <span key={j} className="string">"{part}"</span> : part)}</div>;
            return <div key={i}>{line}</div>;
          })}
        </div>
      </div>

      {/* Docker Commands */}
      <div className="card">
        <h2>⚡ Docker Commands</h2>
        <p className="subtitle">Build and run your backend container</p>

        <ul className="step-list">
          {buildCommands.map((item, i) => (
            <li key={i}>
              <strong>{item.desc}</strong>
              <div className="code-block" style={{ marginTop: 6 }}>
                <span className="prompt">$ </span>{item.cmd}
              </div>
            </li>
          ))}
        </ul>

        <button className="btn btn-primary mt-16" onClick={simulateBuild}>
          ▶ Simulate Docker Build & Run
        </button>
      </div>

      {/* Container Status */}
      <div className="card">
        <h2>📦 Container Status</h2>
        <div className="container-grid">
          <div className={`docker-container ${containerStatus}`}>
            <div className="container-icon">☕</div>
            <div className="container-name">my-backend</div>
            <span className={`container-status ${containerStatus}`}>
              {containerStatus === "stopped" && "⬤ Stopped"}
              {containerStatus === "building" && "⬤ Building..."}
              {containerStatus === "running" && "⬤ Running"}
            </span>
            <div className="container-port">Port: 8080 → 8080</div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      {showTerminal && (
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">Terminal — docker build & run</span>
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
