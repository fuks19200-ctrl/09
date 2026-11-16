import fs from "node:fs";
import path from "node:path";

export default function DebugMoodboard() {
  const file = path.join(process.cwd(), "Лавандовый футуристический мудборд.png");
  const base64 = fs.readFileSync(file).toString("base64");
  return (
    <main style={{ margin: 0, padding: 24, background: "#fff" }}>
      <img
        src={`data:image/png;base64,${base64}`}
        alt="MULTUM moodboard"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
      />
    </main>
  );
}
