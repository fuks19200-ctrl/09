import fs from "node:fs";
import path from "node:path";

export default function DebugWorks() {
  const file = path.join(process.cwd(), "public", "images", "works", "01.png");
  const src = fs.readFileSync(file).toString("base64");
  return <main style={{margin:0,padding:24,background:"#fff"}}><img src={`data:image/png;base64,${src}`} alt="work 1" style={{display:"block",maxWidth:"100%",height:"auto"}} /></main>;
}
