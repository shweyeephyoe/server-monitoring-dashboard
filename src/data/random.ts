/**
 * A tiny "seeded" random number generator (the well-known mulberry32 algorithm).
 *
 * Why not Math.random()? Math.random() gives different numbers on every page
 * load, so the charts would jump around and tests could not rely on the data.
 * A seeded generator always produces the same sequence for the same seed:
 * the data looks random but is fully repeatable.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296; // a number between 0 and 1
  };
}
