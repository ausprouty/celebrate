window.CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config
  config.uiColor = '#efefef'
  config.toolbarGroups = [
    { name: 'styles', groups: ['styles'] },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    {
      name: 'editing',
      groups: ['find', 'selection', 'spellchecker', 'editing']
    },
    { name: 'links', groups: ['links'] },
    { name: 'insert', groups: ['insert'] },
    { name: 'forms', groups: ['forms'] },
    { name: 'tools', groups: ['tools'] },
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'others', groups: ['others'] },
    '/',
    {
      name: 'paragraph',
      groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
    },
    { name: 'colors', groups: ['colors'] },
    { name: 'about', groups: ['about'] }
  ]

  config.removeButtons = 'Underline,Subscript,Superscript'
}
