<h1 align="center">
   <b>
        Getting started
    </b>
</h1>

<p align="center">Follow this to get started and use mediator easily.</p>
<br />

## Table of Contents

- [Installation](#installation)
- [Do you need a startup.ts?](#do-you-need-a-startupts)

<br />

## Installation

To install mediator and get started use:

```bash
npm install @arashghafoori/mediator
```

<br />

## Do you need a startup.ts?

For a more complicated project with many handler, stores and etc. you can use a startup function to register everything, this will help you to organize your project further.

Create a file in you project in my case i'll name it _`startup.ts`_:

```ts
// startup.ts

import type Container from "@arashghafoori/mediator/container";

export default function startup(container: Container) {
  // register everything here...
}
```

Then in the main - in my case _`main.ts`_ - file call the startup function:

```ts
// startup.ts

import mediator from "@arashghafoori/mediator";
import startup from "./startup";

startup(mediator);
```
