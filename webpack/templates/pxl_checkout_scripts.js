const path = require('path');
const warning = require('./warning');

const CHECKOUT_SCRIPTS = ['vendor-checkout', 'checkout'];

module.exports = config => `
  ${warning('pxl_checkout_scripts.js')}

  {% if settings.enable_polyfill %}
    <script src="{{ settings.polyfill_service }}" defer="defer"></script>
  {% endif %}

  {% include 'pxl_config' %}

  ${config.htmlWebpackPlugin.files.js
    .map(jsFile => {
      const { base } = path.parse(jsFile);
      const name = base.substr(0, base.indexOf('.'));

      const script = `
        <script src="{{ '${base}' | asset_url | split: '?' | first | append: '?${Date.now()}' }}" defer="defer"></script>
      `;

      if (CHECKOUT_SCRIPTS.indexOf(name) > -1) {
        return script;
      }
    })
    .join('')}
`;
