window.CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // THESE CHANGES SEEM TO WORK
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  config.toolbarGroups = [
    { name: 'styles', groups: ['styles'] },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    {
      name: 'editing',
      groups: ['find', 'selection', 'spellchecker', 'editing']
    },
    { name: 'links', groups: ['links'] },
    { name: 'insert', groups: ['insert'] },
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
  config.removeButtons =
    'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,Iframe,ImageButton,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
}
