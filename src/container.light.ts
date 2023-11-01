import { EventContainer } from "./container.event";
import { ServiceContainer } from "./types";

export class LightContainer extends EventContainer {
  public store: Map<string, unknown> = new Map<string, unknown>();

  public register_service = <T extends ServiceContainer<J>, J>(service: T) => {
    if (!this.store.has(`s#${service.name}`)) {
      this.store.set(`s#${service.name}`, service);
    }
  };

  public service = <T>(name: string) => {
    const service = this.resolve<ServiceContainer<T>>(name, "s");
    const factory = service?.factory;
    if (service && service.life == "Singleton") return service.instance;
    if (factory) return factory();
  };
}
