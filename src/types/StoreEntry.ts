export interface StoreEntry {
  type: "r" | "w" | "e" | "p" | "h" | "s";
  value: unknown;
}
