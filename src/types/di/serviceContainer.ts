export default interface ServiceContainer<T> {
  name: string;
  life: "Singleton" | "Transient";
  factory?: () => T;
  instance?: T;
}
