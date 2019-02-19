window.CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config
  config.uiColor = '#04DC6E'
  config.toolbar = [['Source', '-', 'Bold', 'Italic']]

  config.autoGrow_bottomSpace = 50
  config.colorButton_colors = '00923E,F8C100,28166F'
  config.easyimage_toolbar = [
    'EasyImageAlignLeft',
    'EasyImageAlignCenter',
    'EasyImageAlignRight'
  ]
}
