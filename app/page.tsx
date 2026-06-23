"use client";

import { useState } from "react";

const DEFAULT_CONFIG = `{
  "level": 1,
  "difficulty": "easy",
  "reward": 100,
  "time_limit": 60
}`;

export default function Home() {
  const [input, setInput] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsed = JSON.parse(input);

      const res = await fetch("/api/config-validator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON format");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Game Config Validator</h1>

      <p style={styles.subtitle}>
        Paste a configuration JSON and analyze balance & design risks.
      </p>

      <div style={styles.grid}>
        {/* INPUT */}
        <div style={styles.card}>
          <h2>Configuration</h2>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.textarea}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Validating..." : "Validate"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.card}>
          <h2>Result</h2>

          {!result && <p>No result yet</p>}

          {result && (
            <pre style={styles.pre}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: "#555",
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
  },
  textarea: {
    width: "100%",
    height: 250,
    fontFamily: "monospace",
    fontSize: 13,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  pre: {
    background: "#f6f6f6",
    padding: 12,
    overflowX: "auto",
    fontSize: 12,
  },
};