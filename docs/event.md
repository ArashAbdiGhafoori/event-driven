<h1 align="center">
   <b>
        Event
    </b>
</h1>

<p align="center">Process of registering, listening and firing events.</p>
<br />

## Table of Contents

- [Registering](#registering)
- [Listening](#listening)
- [Firing](#firing)

<br />

## Registering

Things to consider:

- An event won't fire until there is at least one listener.
- A listener can be fired with any data make sure to check inputs.

With _`<event-name>`_ being the name we fire the event with and the _`<count>`_ being the number of times that the event can fire (default to -1 = unlimited), we register an event like so:

```ts
mediator.register.event(
  event-name: string,
  count: number);
```

<br />

## Listening

Things to consider:

- You can register an event if it doesn't exist by setting the register to true, also you can set the count as well.

With _`<event-name>`_ being the name you registered the event with, the _`callback`_ being the function which is called with _`eventData`_ and _`TEventData`_ being the type of _`eventData`_, you can listen to an event by calling :

```ts
mediator.on<TEventData>(
    event-name: string,
    callback: (eventData: TEventData) => void,
    register? = false,
    register-count? = -1
  );
```

For example:

```ts
mediator.on("request", (data) => {
  console.log(`Requested: ${data}`);
});
```

<br />

## Firing

With _`<event-name>`_ being the name of the event, _`<event-data>`_ being the eventData which is passed to listeners' _`callback`_ and _`TEventData`_ being the type of _`<event-data>`_, to fire an event:

```ts
  mediator.fire<TEventData>(
    event-name: string,
    event-data: TEventData
  );
```

<br />
