export const BASE_ATTR = 'data-region-switcher';
const TOGGLE_ELEM = `${BASE_ATTR}-toggle`;
const SHIPPING_SELECT = `${BASE_ATTR}-shipping`;
const LANGUAGE_SELECT = `${BASE_ATTR}-language`;

/**
 * A select that emits "update" events with the newly selected region.
 * See snippets/region_switcher.liquid
 * @param {object} params
 *  @param {object} params.$elem
 *  @param {string} params.initialRegion
 *  @param {object} params.flags
 *  @param {function} params.onUpdate
 */
const RegionSwitcher = ({ $elem, initialRegion, flags, onUpdate }) => {
  let currentValue;

  const $toggle = $elem.find(`[${TOGGLE_ELEM}]`);
  const $shippingSelect = $elem.find(`[${SHIPPING_SELECT}]`);

  $toggle.on('click', () => {
    $elem.toggleClass('is-open');
  });

  const setRegion = regionCode => {
    if (currentValue !== regionCode) {
      currentValue = regionCode;
      $shippingSelect.val(regionCode);
    }

    $toggle.find('img').attr('src', flags[regionCode]);
  };

  setRegion(initialRegion);

  $shippingSelect.on('change', e => {
    const { value } = e.currentTarget;

    currentValue = value;

    onUpdate(value);
  });

  if (window.PxlApp.featureFlags.langify) {
    const $languageSelect = $elem.find(`[${LANGUAGE_SELECT}]`);

    $languageSelect.on('change', e => {
      if ('langify' in window) {
        const { value } = e.currentTarget;

        window.langify.helper.saveLanguage(value);
      }
    });
  }

  return {
    setRegion
  };
};

export default RegionSwitcher;
