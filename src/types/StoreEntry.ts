export interface StoreEntry {
  type: "readable" | "writable" | "event" | "pipeline" | "handler" | "service";
  value: unknown;
}
