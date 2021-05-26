import { configureScope, init, captureException } from '@sentry/browser';

const { sentry, customer } = window.PxlApp;
const { theme } = Shopify;

/**
 * Initialize the Sentry SDK with any relevent context.
 *
 * @example
 * Sentry.configure();
 */
export const configure = () => {
  configureScope(scope => {
    if (customer) scope.setUser({ id: customer.id });
    scope.setTag('theme', theme.name);
  });

  init({
    dsn: sentry.dsn,
    release: `${__NAME__}@${__VERSION__}`,
    environment: __PROD__ ? 'production' : 'development'
  });
};

/**
 * Wraps a function that reports any caught errors to sentry.
 * @param {function} run
 *
 * @example
 * Sentry.withExceptions(() => {});
 */
export const withExceptions = run => {
  try {
    run();
  } catch (error) {
    captureException(error);
  }
};
