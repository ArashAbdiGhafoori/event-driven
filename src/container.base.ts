import { StoreEntry } from "./types/StoreEntry";

export class BaseContainer {
    public store: Map<string, StoreEntry> = new Map<string, StoreEntry>();

    
  /** Resolves entries to types
   *
   * @param name The name of the entry to resolve.
   * @param type The type to resolve
   * @returns The resolved entry.
   */
  protected resolve<T>(
    name: string,
    type: "readable" | "writable" | "event" | "pipeline" | "handler" | "service"
  ) {
    const entry = this.store.get(name);
    if (entry && entry.type == type && entry.value) {
      return entry.value as T;
    }
  }
}