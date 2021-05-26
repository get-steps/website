// import lazySizes from 'lazysizes';
import $dom from 'cash-dom';
import {
  updateSelectBoxImages,
  addMetafields,
  updateShoeSelect,
  onLoadUrlVariantHelper,
  updateMetaSelect
} from './sections/product';
import * as Sentry from './modules/sentry';
import { productCarousel } from './sections/pxl_product_carousel';
import { pressSection } from './sections/press';
// import { toggleClass } from './utils/state_helpers';

const init = () => {
  if ($dom('body.template-product').length > 0) {
    productCarousel();
  }

  // must load after the above
  onLoadUrlVariantHelper();
  const shoeSelect = $('select.product-variant-select')[0];
  const materialSelect = $('select.product-variant-select')[1];
  updateSelectBoxImages();
  addMetafields(shoeSelect);
  addMetafields(materialSelect);
  updateShoeSelect();
  updateMetaSelect();
  pressSection();
};

Sentry.configure();

Sentry.withExceptions(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
