
export class BaseContainer {
  public store: Map<string, unknown> = new Map<string, unknown>();

  /** Resolves entries to types
   *
   * @param name The name of the entry to resolve.
   * @param type The type to resolve
   * @returns The resolved entry.
   */
  protected resolve<T>(name: string, type: "r" | "w" | "e" | "p" | "h" | "s") {
    const entry = this.store.get(`${type}#${name}`);
    return entry as T;
  }

  /**
   * Removes any type of added entry (event listners, pipelines, services, etc. ).
   * @param name The name of the entry to remove.
   */
  public off(name: string, type: "readable" | "writable" | "event" | "pipeline" | "handler" | "service") {
    this.store.delete(`${type[0]}#${name}`);
  }
}
