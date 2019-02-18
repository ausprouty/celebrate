window.CKEDITOR_BASEPATH = `/node_modules/ckeditor/`;
// Load your custom config.js file for CKEditor.
require(`!file-loader?context=${__dirname}&outputPath=node_modules/ckeditor/&name=[path][name].[ext]!./config.js`)

const plugins = 'wsc|scayt|copyformatiing';

// Load files from plugins, excluding lang files.
// Limit to active plugins with
// Object.keys(CKEDITOR.plugins.registered).sort().toString().replace(/,/g, '|')
require.context(
  '!file-loader?name=[path][name].[ext]!ckeditor/plugins/',
  true,
       // plugins|needed|by|ckeditor
  /^\.\/((wsc|scayt|copyformatiing)(\/(?!lang\/)[^/]+)*)?[^/]*$/
);

// Load lang files from plugins.
// Limit to active plugins with
// Object.keys(CKEDITOR.plugins.registered).sort().toString().replace(/,/g, '|')
require.context(
  '!file-loader?name=[path][name].[ext]!ckeditor/plugins/',
  true,
      // plugins|needed|by|ckeditor
  /^\.\/(wsc|scayt|copyformatiing)\/(.*\/)*lang\/(en|es)\.js$/
);

// Load CKEditor lang files.
require.context(
  '!file-loader?name=[path][name].[ext]!ckeditor/lang',
  true,
  /(en|es)\.js/
);

// Load skin.
require.context(
  '!file-loader?name=[path][name].[ext]!ckeditor/skins/moono-lisa',
  true,
  /.*/
);
