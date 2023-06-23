export default interface Service<T> {
  name: string;
  life: "Singleton" | "Transient" | "Both";
  factory?: () => T;
  instance?: T;
}
