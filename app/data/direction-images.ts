import { existsSync } from "node:fs";
import { join } from "node:path";

export function directionImages(slug: string): string[] {
  if (slug === "3d") {
    const files = ["3d-dog.gif", "3d-wall.gif", "3d-tv.gif"];
    return files.map(file => existsSync(join(process.cwd(), "public", "images", file)) ? "/images/" + file : "");
  }
  if (slug === "development") {
    const files = [
      "Ноутбук с лендингом MULTUM.AI.png",
      "Творческое рабочее место с кодом.png",
      "Современная игровая станция с неоновой гонкой.png",
    ];
    return files.map(file => existsSync(join(process.cwd(), "public", "images", file)) ? "/images/" + encodeURIComponent(file) : "");
  }
  return Array.from({ length: 6 }, (_, index) => {
    const stem = slug + "-" + String(index + 1).padStart(2, "0");
    const file = ["webp", "jpg", "jpeg", "png"].map(ext => stem + "." + ext).find(name => existsSync(join(process.cwd(), "public", "images", name)));
    return file ? "/images/" + file : "";
  });
}
