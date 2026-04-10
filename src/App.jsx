import { useState } from "react";
import BackendDockerfile from "./components/BackendDockerfile";
import FrontendDockerfile from "./components/FrontendDockerfile";
import DockerCompose from "./components/DockerCompose";

/*
  Experiment 9 — Containerize and Run a Full-Stack App using Docker & Docker Compose

  Part (a): Dockerfile for Spring Boot backend
  Part (b): Dockerfile for React frontend (Nginx)
  Part (c): Docker Compose for full stack (frontend + backend + database)
*/

export default function App() {
  const [activeTab, setActiveTab] = useState("a");

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Experiment 9 — Docker & Docker Compose</h1>
        <p>Containerize and run a full-stack application</p>
      </header>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "a" ? "active" : ""}`}
          onClick={() => setActiveTab("a")}
        >
          (a) Backend Dockerfile
        </button>
        <button
          className={`tab-btn ${activeTab === "b" ? "active" : ""}`}
          onClick={() => setActiveTab("b")}
        >
          (b) Frontend Dockerfile
        </button>
        <button
          className={`tab-btn ${activeTab === "c" ? "active" : ""}`}
          onClick={() => setActiveTab("c")}
        >
          (c) Docker Compose
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "a" && <BackendDockerfile />}
      {activeTab === "b" && <FrontendDockerfile />}
      {activeTab === "c" && <DockerCompose />}
    </div>
  );
}
