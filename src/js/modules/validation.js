import $ from 'cash-dom';

/**
 * The party packs form is made up of three required radio inputs. The submit button
 * is disabled by default untill one is selected. Once the form changes we
 * validate that one is selected and remove the disabled attribute from the submit button.
 *
 * @see shop/sections/purchase.liquid
 *
 * @example
 * validatePartyPacksForm();
 */
export const validatePartyPacksForm = () => {
  $('#party_packs').on('change', function() {
    if (!this.checkValidity()) {
      return;
    }

    $(this)
      .find('[data-regionalise-buy-link]')
      .removeAttr('disabled');
  });
};
