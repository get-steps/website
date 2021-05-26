import * as Sentry from './modules/sentry';

const init = () => {};

Sentry.configure();

Sentry.withExceptions(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
