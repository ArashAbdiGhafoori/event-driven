<h1 align="center">
   <b>
        Dependency injection
    </b>
</h1>

<p align="center">Process of registering and injecting transient and singleton services.</p>
<br />

## Table of Contents

- [Registering](#registering)
  - [Transient](#transient-service)
  - [Singleton](#singleton-service)
  - [Register it](#finally-register-it)
- [Injecting](#injecting)

<br />

## Registering

The container keeps both transient and singleton services in a _`Map`_ and the registration is the same, the only thing that is different is the to whether add instance, factory or both!

Things to keep in mind:

- The name of the service, by which you'll be able to get the service, is the _`service.name`_ property of the service object you are registering.

- Services won't override so if an service with the same name exists, the new object will be ignored.

- The _`service.life`_ property of the service object is currently not used for anything and is there to check whether the return service is transient or singleton for you!

<br />

#### <b>Transient Service</b>:

To register a transient service you'll need a object implementing [Service Container](../src/types/di/serviceContainer.ts) with life being _`Transient`_ and factory being a function that returns an instance of service:

```ts
const serviceContainer = {
    name: "<service-name>";
    life: "Transient";
    factory: () => {
        return <service-instance>
    };
}
```

<br />

#### <b>Singleton Service</b>:

To register a singleton service you'll need a object implementing [Service](../src/types/di/serviceContainer.ts) with life being _`Singleton`_ and _`service.instance`_ being the singleton instance of the service:

```ts
const serviceContainer = {
    name: "<service-name>";
    life: "Singleton";
    instance: <service-instance>;
}
```

<br />

#### <b>Finally register it</b>:

```ts
mediator.register.service(service);
```

or with a instanced container:

```ts
const container = mediator.container("<container-name>");
container.register.service(service);
```

## Injecting

Things to remember:

- _`TService`_ Type is not _`ServiceContainer<TService>`_ it's simply the type of your service, for example if your service's type is _`UserManager`_ you will call _`mediator.get.service<UserManager>(service);`_

To Inject your service you'll need to simply get it from container, it's the same for transient or singleton:

```ts
const serviceContainer = mediator.get.service<TService>(service);
```

or ignore _`TService`_:

```ts
const serviceContainer = mediator.get.service(service);
```

so to inject it to a class like _`TestClass`_, simply do this:

```ts
class TestClass {
  private myService: TService;
  constructor() {
    this.myService = mediator.get.service("serviceName");
  }
}
```

or if TService has a static _`name`_ property:

```ts
...
    this.myService = mediator.get.service(TService.name)
...
```

<br />
