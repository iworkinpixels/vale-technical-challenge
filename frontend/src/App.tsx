import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

interface PingResponse {
  echo: string;
  timestamp: number;
  env: string;
  version: string;
}

type Status = "idle" | "loading" | "success" | "validation-error" | "api-error";

function validateMessage(message: string): string | null {
  if (message.length === 0) return "Message is required.";
  if (message.length > 20) return "Message must be 20 characters or fewer.";
  if (message !== message.toLowerCase()) return "Message must be all lowercase.";
  return null;
}

export default function App() {
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState<PingResponse | null>(null);
  const [error, setError] = useState("");

  async function submitMessage(messageToSend: string): Promise<void> {
    setStatus("loading");
    const validationError = validateMessage(messageToSend);

    if (validationError) {
      setStatus("validation-error");
      setError(validationError);
      setResponse(null);
      return;
    }

    setError("");
    setResponse(null);
    setLastMessage(messageToSend);

    try {
      const apiResponse = await fetch("http://localhost:8000/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!apiResponse.ok) {
        throw new Error(`API returned status ${apiResponse.status}`);
      }

      const data: PingResponse = await apiResponse.json();
      setResponse(data);
      setStatus("success");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unknown network error";

      setStatus("api-error");
      setError(message);
    }
  }

  function handleReset(): void {
    setMessage("");
    setLastMessage("");
    setStatus("idle");
    setResponse(null);
    setError("");
  }

  function handleRetry(): void {
    void submitMessage(lastMessage || message);
  }

  return (
    <main className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 mb-3">Vale Coding Challenge</h1>

          <label htmlFor="message" className="form-label">
            Message To Send To Backend API
          </label>

          <input
            id="message"
            className="form-control"
            value={message}
            maxLength={30}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="enter lowercase message"
          />

          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={() => void submitMessage(message)}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting..." : "Submit"}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={handleRetry}
              disabled={status !== "api-error"}
            >
              Retry
            </button>

            <button className="btn btn-outline-danger" onClick={handleReset}>
              Reset
            </button>
          </div>

          <section className="mt-4">
            {status === "idle" && <p className="text-muted">Enter a message to begin.</p>}

            {status === "loading" && (
              <div className="d-flex flex-column align-items-center">
                <div className="spinner" />
                <p>Loading...</p>
              </div>
            )}

            {status === "validation-error" && (
              <div className="alert alert-warning">Validation error: {error}</div>
            )}

            {status === "api-error" && (
              <div className="alert alert-danger">API/network error: {error}</div>
            )}

            {status === "success" && response && (
              <div className="alert alert-success">
                <h2 className="h5">Success</h2>
                <p><strong>Echo:</strong> {response.echo}</p>
                <p><strong>Timestamp:</strong> {response.timestamp}</p>
                <p><strong>Environment:</strong> {response.env}</p>
                <p><strong>Version:</strong> {response.version}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
