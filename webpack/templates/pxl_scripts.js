const path = require('path');
const warning = require('./warning');

const MAIN_SCRIPTS = ['vendor-main', 'main'];

module.exports = config => `
  ${warning('pxl_scripts.js')}

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

      if (MAIN_SCRIPTS.indexOf(name) > -1) {
        return script;
      }

      return `
        {% if template.name == '${name}' or template.suffix == '${name}' %}
          ${script}
        {% endif %}
      `;
    })
    .join('')}
`;
