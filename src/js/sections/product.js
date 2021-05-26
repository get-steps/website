import $ from 'cash-dom';
// import latinize from '../utils/helpers';

const { formId, variantMaterialIgnore } = window.PxlApp;

export const updateSelectBoxImages = () => {
  $('.product-variant-select').on('change', function() {
    const currentStyles = this.getAttribute('style').split(', ');

    const cachedAssetURL = $(
      `.hidden-select-image[data-name="${this.value}"]`
    ).attr('src');
    this.setAttribute('style', `${currentStyles[0]}, url('${cachedAssetURL}')`);
  });
};

// Handles all of the functions that should be run
// When user changes shoe selection
export const updateShoeSelect = () => {
  const shoeSelect = $('.product-variant-select')[0];
  const materialSelect = $('select.product-variant-select')[1];
  $(shoeSelect).on('change', function(e) {
    selectAvailable(e.target);
    addMetafields(materialSelect); // retrigger in case the first load this was hidden
  });
};

export const updateMetaSelect = () => {
  const shoeSelect = $('.product-variant-select');
  $(shoeSelect).on('change', function(e) {
    addMetafields(e.target);
  });
};

//  Returns shoe type defined on the select option data tag
export const getShoeType = e => {
  let shoeType = e.value.toLowerCase().split(' ')[0];
  shoeType = shoeType.replace('ü', 'u');
  if (__DEV__) {
    console.log('shoetype is..', shoeType);
  }
  return shoeType;
};

// Some shoe types should not have material select
export const selectAvailable = e => {
  const productFormId = formId.product_form_id;
  // long selector to be refactored to admin control when budget allows
  /* eslint-disable */
  const shoeType = getShoeType(e);
  const materialSelectWrapper =  $(`#product_form_${productFormId} > div.product__selectors.swatch--${productFormId} > div:nth-child(2)`);
  const childOptions = $(materialSelectWrapper).find('option');
  const hiddenMaterial = childOptions[3];
  if (shoeType === 'sicherheitsschuhe') {
    $(`#SingleOptionSelector-1-${productFormId}`)[0].selectedIndex = 3;
    materialSelectWrapper.hide();

    // Unwrap the last item to keep logic the same
    if( ($(hiddenMaterial).parent().is('span')) ) $(hiddenMaterial).unwrap();
  } else {
    $(`#SingleOptionSelector-1-${productFormId}`).show();
    $(`#SingleOptionSelector-1-${productFormId}`)[0].selectedIndex = 0;
    materialSelectWrapper.show();

    // hide final material option in iOS (Also see corresponding logic change at line 1889 theme.js)
    if( !($(hiddenMaterial).parent().is('span')) ) $(hiddenMaterial).wrap('<span style="display: none;">');
  }
  /* eslint-enable */
};

export const onLoadUrlVariantHelper = () => {
  let hiddenVariantSelector = $('#hidden-all-variants');
  let onLoadVariant = $(hiddenVariantSelector)
    .find("option[selected='selected']")
    .val();

  // check for variant that should have its material hidden on load (from theme setting)
  if (onLoadVariant === variantMaterialIgnore.variant_id) {
    $(`#SingleOptionSelector-1-${formId.product_form_id}`)
      .parent('.selector-wrapper')
      .hide();
  }
};

// Grabs metafield values from an entry namespaced with the shoe's type
export const addMetafields = e => {
  let parent = $(e).parents('.selector-wrapper');
  $(parent)
    .find('.shoe-metafield')
    .hide();
  let shoeType = getShoeType(e);
  $(`.shoe-metafield.${shoeType}`).show();
};
