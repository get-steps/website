import Glide from '@glidejs/glide';
import Html from '@glidejs/glide/src/components/html';
import Controls from '@glidejs/glide/src/components/controls';
import $ from 'cash-dom';

/*
Hotfix from https://github.com/glidejs/glide/pull/457#issuecomment-586179069 to support
dynamic reloading of Glide contents
*/
function HtmlFix(Glide, Components, Events) {
  const HtmlFix = Html(Glide, Components, Events);
  Events.on('update', () => {
    HtmlFix.mount();
  });
  return HtmlFix;
}

/*
Takes an already initialised Glide object, and the new variantID,
and updates the contents of the glide track with the relevant images for that variant,
along with updating the bullets, and then updating the Glide object.
*/
function loadSlides(carousel, variantID) {
  // Rebuild Slides
  $('#product-carousel-slides').css('opacity', '0');
  $(`#product-carousel .glide__slide`).remove();
  let slides = $(`
  #carousel-slides-storage [data-variant="${variantID}"]
  `);
  $('#product-carousel-slides').append(slides.clone());
  $('#product-carousel-slides').css('opacity', '1');

  // Rebuild Bullets
  $('#product-carousel .glide__bullet').remove();
  for (let i = 0; i < slides.length; i++) {
    $('#product-carousel .glide__bullets').append(`
      <button class="glide__bullet" data-glide-dir="=${i}"></button>
      `);
  }

  // Trigger Glide Update
  carousel.update();
}

export const productCarousel = () => {
  let carousel = new Glide('.glide');
  carousel.mount({ Html: HtmlFix });

  $('body').on('pxlVariantChange', function(event) {
    loadSlides(carousel, event.detail.id);
    carousel.mount({ Html: HtmlFix, Controls });
  });
};
