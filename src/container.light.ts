import { EventContainer } from "./container.event";
import { ServiceContainer } from "./types";
import { StoreEntry } from "./types/StoreEntry";

export class LightContainer extends EventContainer {
  public store: Map<string, StoreEntry> = new Map<string, StoreEntry>();

  public register_service = <T extends ServiceContainer<J>, J>(service: T) => {
    if (!this.store.has(service.name)) {
      this.store.set(service.name, { type: "service", value: service });
    }
  };

  public service = <T>(name: string) => {
    const service = this.resolve<ServiceContainer<T>>(name, "service");
    const factory = service?.factory;
    if (service && service.life == "Singleton") return service.instance;
    if (factory) return factory();
  };
}
