'use strict';

module.exports = {
  framework: 'qunit',
  test_page: 'ez-offscreen-canvas-tests.html',
  launch_in_dev: [
    'Chrome'
  ],
  launch_in_ci: [
    'Chrome'
  ],
  browser_args: {
    Chrome: {
      ci: ['--headless', '--remote-debugging-port=9222']
    }
  }
};
