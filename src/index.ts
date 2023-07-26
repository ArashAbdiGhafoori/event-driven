import mediator from "./mediator";

const mediatorInstance = (() => {
  mediator.instance = mediator.instance || new mediator();
  return mediator.instance;
})();

export { mediatorInstance as mediator };
