// see http://vuejs-templates.github.io/webpack for documentation.
//const path = require("path");
module.exports = {
  // crossorigin:
  //   '<script src="http://192.168.56.1:8080" crossorigin="anonymous"></script>',
  publicPath:
   // process.env.NODE_ENV === 'production' ? '/edit/dist/' : '/edit/dist/'
    process.env.NODE_ENV === 'production' ? '/' : '/'
  // outputDir: path.resolve(__dirname, "/xampp/htdocs/edit"),
}
