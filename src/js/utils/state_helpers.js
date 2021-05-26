import $ from 'cash-dom';

/**
 * Helper for easy state changes between classes on elements.
 *
 * @example
 * <button class="hamburger data-toggle="menu-open" data-toggle-default="menu-closed" data-toggle-target="body" data-toggle-transition-speed="200">
 *
 * @see https://github.com/pixelcabin/wool_and_womens for origin
 */
export const toggleClass = () => {
  $('[data-toggle]').on('click', function() {
    const $target = $($(this).data('toggle-target'));
    const transitionSpeed = $(this).data('toggle-transition-speed') || 0;
    const className = $(this).data('toggle');
    const defaultClassName = $(this).data('toggle-default');

    if ($target.hasClass(className)) {
      $target.addClass(defaultClassName);
      setTimeout(() => $target.removeClass(className), transitionSpeed);
    } else {
      $target.addClass(className);
      $target.removeClass(defaultClassName);
    }
  });
};
