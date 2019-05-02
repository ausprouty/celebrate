var customDialog = function( editor )
{
   return {
      id: editor.name,
      title : 'Please upload your pictures',
      minWidth: 300,
      minHeight: 80,
      onShow : function()
      {
      },
      onOk : function()
      {
      },
      onLoad : function()
      {
      },
      onHide : function()
      {
      },
      
      contents : [
      {
         id : 'info',
         label: 'Picture',
         title: 'Picture',
         elements : [{
            id: 'choosefile',
            type: 'file',
            validate: function() {
               var pass = true;

               var choosefile = this.getDialog().getContentElement('info', 'choosefile').getInputElement();
               if (choosefile.$.files.length == 0) {
                  pass = false;
               }
               if (!pass) {
                  return 'Choose one or more files';
               }
            }
         }]
      }]
   };
};

CKEDITOR.dialog.add( 'customPicture', function(editor)
{
   return customDialog(editor);
});