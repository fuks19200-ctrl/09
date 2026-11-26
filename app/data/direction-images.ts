import { existsSync } from "node:fs";
import { join } from "node:path";

export function directionImages(slug: string): string[] {
  return Array.from({ length: 6 }, (_, index) => {
    const stem = slug + "-" + String(index + 1).padStart(2, "0");
    const file = ["webp", "jpg", "jpeg", "png"].map(ext => stem + "." + ext).find(name => existsSync(join(process.cwd(), "public", "images", name)));
    return file ? "/images/" + file : "";
  });
}
