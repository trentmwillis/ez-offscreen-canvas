# ez-offscreen-canvas

[![CircleCI Build Status](https://circleci.com/gh/trentmwillis/ez-offscreen-canvas/tree/master.svg?style=svg)](https://circleci.com/gh/trentmwillis/ez-offscreen-canvas/tree/master)

This is a tiny library to make it easier to use [`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). In particular, it does the following:

1. Creates the `OffscreenCanvas` instance from a given `<canvas>` element.
2. Passes the `OffscreenCanvas` and other values from the main thread to a `Worker` thread.
3. Allows you to write your `Worker` code in the main thread as a function.

Here's a short example of how it is used:

```html
<canvas></canvas>

<script type="module">
  import { ezOffscreenCanvas } from './ez-offscreen-canvas.js';

  const canvas = document.querySelector('canvas');
  const props = { startTime: Date.now() };
  const render = ({ canvas, startTime }) => {
    const context = canvas.getContext('2d');
    context.fillText(`Started this drawing at ${startTime}`, 10, 10);
  };

  const { terminate } = ezOffscreenCanvas(canvas, props, render);

  setTimeout(terminate, 10000);
</script>
```
