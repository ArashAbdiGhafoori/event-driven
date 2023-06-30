<h1 align="center">
   <b>
        Command and query responsibility segregation
    </b>
</h1>

<p align="center">Process of registering, requesting handlers.</p>
<br />

## Table of Contents

- [Registering](#registering)
- [Requesting](#requesting)

<br />

## Registering

Things to consider:

- Registering the same name will overwrite the existing handler.
- Request is supposed to have an name property.

With _`<handler-name>`_ being the name we use to handle requests with, the _`<callback>_` being the callback that will handle the request, *`TRequest`* being the type of request and *`TRequestResponse`\* being the type of response, we register an handler like so:

```ts
  evma.register.handler<TRequest, TRequestResponse>(
    handler-name: string,
    callback: (request: TRequest) => TRequestResponse
  );
```

<br />

## Requesting

Things to consider:

- The request needs to have a name property that corresponsds to the name of the handler.

With _`<request>`_ being the request object that is passed to handler, _`TRequest`_ being the type of request and _`TRequestResponse`_ being the type of response, we handle an request like so:

```ts
  let response = evma.handle<TRequest, TRequestResponse>(
    request: TRequest
    );
```

<br />
