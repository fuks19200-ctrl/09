import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export default function DebugWorks() {
  const names = ["01","02","03","04","05"];
  const imgs = names.map((name) => {
    const file = path.join(process.cwd(), "public", "images", "works", name + ".png");
    return fs.readFileSync(file).toString("base64");
  });
  return (
    <main style={{ margin: 0, padding: 24, background: "#fff", display: "grid", gap: 24 }}>
      {imgs.map((src, i) => (
        <img key={i} src={`data:image/png;base64,${src}`} alt={`work ${i+1}`} style={{display:"block", maxWidth:"100%", height:"auto"}} />
      ))}
    </main>
  );
}
