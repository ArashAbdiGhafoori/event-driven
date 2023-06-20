export default interface Service<T> {
  name: string;
  life: "Singleton" | "Transient";
  factory?: () => T;
  instance?: T;
}
