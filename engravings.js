import { ILLUSTRATIONS } from "./illustrations.js";

export function loadEngraving(food) {
  const image = new Image(640, 460);
  image.className = "food-illustration";
  image.alt = `Engraved illustration of ${food.name}`;
  image.decoding = "async";
  image.sizes =
    "(max-width: 680px) calc(100vw - 72px), (max-width: 1100px) 48vw, 600px";
  image.srcset = ILLUSTRATIONS[food.id].srcset;
  image.src = ILLUSTRATIONS[food.id].src;
  return image.decode().then(() => image);
}
