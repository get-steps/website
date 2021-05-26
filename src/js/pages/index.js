import * as Sentry from '../modules/sentry';
// import { imageGallery } from '../modules/image_gallery';

export const init = () => {
  // console.log('welcome to Steps index');
};

Sentry.withExceptions(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
