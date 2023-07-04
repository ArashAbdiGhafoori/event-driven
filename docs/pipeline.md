<h1 align="center">
   <b>
        Pipeline
    </b>
</h1>

<p align="center">Process of registering, using pipelines.</p>
<br />

## Table of Contents

- [Registering Pipeline](#registering-pipeline)
- [Registering Pipe](#registering-pipe)
- [Usage](#usage)

<br />

## Registering pipeline

Things to consider:

- A pipeline after being registered is empty, you'll need to register pipes into the pipeline to be able to use it.

With _`<pipeline-name>`_ being the name to use the pipeline with, we register an pipeline like so:

```ts
evma.register.pipeline(
    pipeline-name: string
);
```

<br />

## Registering pipe

Things to consider:

- A pipe is by default registered at the beginning of the pipeline, to insert it at a diffrent position use the _`at`_ argument,

With _`<pipeline-name>`_ being the name to use the pipeline with, _`callback`_ being the function that passes the value for the next pipe, _`at`_ being the index to insert the pipe at and the _`register`_ defining whether to register the pipe if not already registered, we register an pipeline like so:

```ts
evma.register.pipe<T>(
    pipeline-name: string,
    callback: Pipe<T>,
    at = 0,
    register = false
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
