CKEDITOR.plugins.add( 'picture', {
   init: function( editor ) {
      var customDialog = "customPicture";

      editor.addCommand( '_customPicture', new CKEDITOR.dialogCommand(customDialog));

      CKEDITOR.on('dialogDefinition', function(e) {
         var dialogName = e.data.name;
         var dialog = e.data.definition.dialog;

         if (dialogName === customDialog) {
            dialog.on('ok', function() {

            });
         }
      });

      CKEDITOR.dialog.add(customDialog, '/js/ckeditor/plugin/picture/dialogs/custom.js');

      editor.ui.addButton( 'picture', {
            label: 'Picture',
            command: '_customPicture',
            toolbar: 'insert',
            icon: '../../images/conclusion.png'
      });
   }
});