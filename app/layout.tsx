import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Config Validator",
  description:
    "Validate and analyze game configurations using schema validation and AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={styles.body}>
        <header style={styles.header}>
          <div style={styles.logo}>🎮 Game Config Validator</div>
          <div style={styles.tagline}>
            Schema validation + AI game configuration review
          </div>
        </header>

        <main style={styles.main}>{children}</main>

      </body>
    </html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fafafa",
    color: "#111",
  },
  header: {
    padding: "16px 24px",
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
  },
  tagline: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  main: {
    minHeight: "calc(100vh - 120px)",
    padding: 24,
  },
  footer: {
    padding: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    borderTop: "1px solid #e5e5e5",
    backgroundColor: "#fff",
  },
};