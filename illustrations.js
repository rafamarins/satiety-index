import { FOODS } from "./foods.js";

// The production build substitutes responsive WebP copies of these originals.
export const ILLUSTRATIONS = Object.fromEntries(
  FOODS.map(({ id }) => [
    id,
    { src: `./assets/illustrations/${id}.svg`, srcset: "" },
  ]),
);
