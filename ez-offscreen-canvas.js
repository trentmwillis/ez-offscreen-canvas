const isOffscreenCanvasSupported = () => 'transferControlToOffscreen' in HTMLCanvasElement.prototype;

const moreInfoMessage = 'For more info, see the documentation at https://pretty-okay.dev/ez-offscreen-canvas.';

export const ezOffscreenCanvas = (canvas, props, code) => {
  if (!isOffscreenCanvasSupported())
    throw new Error(`The ezOffscreenCanvas can only be used in browsers that support OffscreenCanvas. ${moreInfoMessage}`);

  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error(`The first argument to ezOffscreenCanvas must be an instance of HTMLCanvasElement. ${moreInfoMessage}`);

  if (typeof props !== 'object')
    throw new Error(`The second argument to ezOffscreenCanvas must be an object or null. ${moreInfoMessage}`);

  if (typeof code !== 'function')
    throw new Error(`The third argument to ezOffscreenCanvas must be a function. ${moreInfoMessage}`);

  const workerCode = `const render = (${code});\nonmessage = (event) => render(event.data);`;
  const blobOfWorkerCode = new Blob([workerCode], {type: 'application/javascript'});
  const workerCodeUrl = URL.createObjectURL(blobOfWorkerCode);

  const worker = new Worker(workerCodeUrl);
  const offscreenCanvas = canvas.transferControlToOffscreen();
  worker.postMessage({
    ...props,
    canvas: offscreenCanvas
  }, [offscreenCanvas]);

  return {
    terminate() {
      worker.terminate();
    }
  };
};
