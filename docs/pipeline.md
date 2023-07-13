<h1 align="center">
   <b>
        Pipeline
    </b>
</h1>

<p align="center">Process of registering, using pipelines.</p>
<br />

## Table of Contents

- [Registering](#registering)
- [Usage](#usage)

<br />

## Registering

Things to consider:

- A pipeline is registered when the first pipe is registered with the pipeline name, so to create a pipeline you just have to add a pipe to an unexisting pipeline!
- A pipe is by default registered at the beginning of the pipeline, to insert it at a diffrent position use the _`at`_ argument,

With _`<pipeline-name>`_ being the name to use the pipeline with, _`callback`_ being the function that passes the value for the next pipe, _`at`_ being the index to insert the pipe at and the _`register`_ defining whether to register the pipe if not already registered, we register an pipeline like so:

```ts
mediator.register.pipe<T>(
    pipeline-name: string,
    callback: Pipe<T>,
    at = 0
);
```

<br />

## Usage

With _`<pipeline-name>`_ being the name of the pipeline to be used, and the _`<input>`_ being the input of the pipeline

```ts
const result = container.pipe<T>(
    pipeline-name: string,
    input: T
);
```

<br />
