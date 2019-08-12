const isOffscreenCanvasSupported = () => 'transferControlToOffscreen' in HTMLCanvasElement.prototype;

const moreInfoMessage = 'For more info, see the documentation at https://pretty-okay.dev/ez-offscreen-canvas.';

const ezOffscreenCanvasWorker = (canvas, props, code) => {
  const workerCode = `const render = (${code});\nlet _canvas;onmessage = (event) => {
    if (event.data._type === 'render') {
      _canvas = event.data.props.canvas;
      render(event.data.props);
    } else if (event.data._type === 'setAttributes') {
      Object.entries(event.data.attributes).forEach(([key, value]) => _canvas[key] = value);
    }
  };`;
  const blobOfWorkerCode = new Blob([workerCode], {type: 'application/javascript'});
  const workerCodeUrl = URL.createObjectURL(blobOfWorkerCode);

  const worker = new Worker(workerCodeUrl);
  const offscreenCanvas = canvas.transferControlToOffscreen();
  worker.postMessage({
    _type: 'render',
    props: {
      ...props,
      canvas: offscreenCanvas
    }
  }, [offscreenCanvas]);

  return {
    setAttributes(attributes) {
      worker.postMessage({
        _type: 'setAttributes',
        attributes,
      });
    },

    terminate() {
      worker.terminate();
    }
  };
};

const ezOffscreenCanvasMainThread = (canvas, props, code) => {
  // "Clone" the function so that it is no longer in scope.
  // However, we can't prevent folks from accessing things in global scope.
  const render = new Function(`return ${code}`)();
  Promise.resolve().then(() => render({ ...props, canvas }));

  return {
    setAttributes(attributes) {
      Object.entries(attributes).forEach(([key, value]) => canvas[key] = value);
    },

    terminate() {}
  };
};

export const ezOffscreenCanvas = (canvas, props, code, options = {}) => {
  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error(`The first argument to ezOffscreenCanvas must be an instance of HTMLCanvasElement. ${moreInfoMessage}`);

  if (typeof props !== 'object')
    throw new Error(`The second argument to ezOffscreenCanvas must be an object or null. ${moreInfoMessage}`);

  if (typeof code !== 'function')
    throw new Error(`The third argument to ezOffscreenCanvas must be a function. ${moreInfoMessage}`);

  if (!isOffscreenCanvasSupported()) {
    if (options.workerOnly) throw new Error(`The ezOffscreenCanvas can only be used in browsers that support OffscreenCanvas. ${moreInfoMessage}`);
    return ezOffscreenCanvasMainThread(canvas, props, code);
  }

  return ezOffscreenCanvasWorker(canvas, props, code);
};
