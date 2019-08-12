# ez-offscreen-canvas

[![CircleCI Build Status](https://circleci.com/gh/trentmwillis/ez-offscreen-canvas/tree/master.svg?style=svg)](https://circleci.com/gh/trentmwillis/ez-offscreen-canvas/tree/master)

This is a tiny library to make it easier to use [`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). In particular, it does the following:

1. Creates the `OffscreenCanvas` instance from a given `<canvas>` element.
2. Passes the `OffscreenCanvas` and other values from the main thread to a `Worker` thread.
3. Allows you to write your `Worker` code in the main thread as a function.
4. Falls back to running in the main thread if `OffscreenCanvas` is not supported.

Here's a short example of how it is used:

```html
<canvas></canvas>

<script type="module">
   import { ezOffscreenCanvas } from 'https://unpkg.com/ez-offscreen-canvas';

  const canvas = document.querySelector('canvas');
  const props = { color: 'red' };

  // The code in this function will run in a Web Worker
  // which means it can't access variables in the closure
  const render = ({ canvas, color }) => {
    const context = canvas.getContext('2d');

    const draw = () => {
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    };

    draw();
  };

  const offscreenCanvas = ezOffscreenCanvas(canvas, props, render);

  // Since control has been transferred to an OffscreenCanvas
  // we can't set attributes on the original canvas directly
  offscreenCanvas.setAttributes({ width: 700, height: 350 });

  // Make sure we cleanup the Web Worker when no longer needed
  setTimeout(offscreenCanvas.terminate, 10000);
</script>
```

See [the above code running live on CodePen](https://codepen.io/trentmwillis/pen/LwyZQW).

## Requiring OffscreenCanvas in a Web Worker

If you only want the render function to run if `OffscreenCanvas` is available and can run in a Web Worker, then pass an options hash with `workerOnly` set to `true` as the fourth argument to the `ezOffscreenCanvas` method:

```javascript
ezOffscreenCanvas(canvas, props, render, { workerOnly: true });
```
