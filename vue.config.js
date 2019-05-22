// see http://vuejs-templates.github.io/webpack for documentation.

module.exports = {
  // crossorigin:
  //   '<script src="http://192.168.56.1:8080" crossorigin="anonymous"></script>',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? '/prototype/' : '/'
}
