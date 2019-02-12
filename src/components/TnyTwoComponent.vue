Vue.component('tinymce', {
	props: ['value'],
	template: '#tinymce-template',
	methods: {
		updateValue: function (value) {
            console.log(value);
			this.$emit('input', value.trim());
		}
	},
    mounted: function(){
      
      var component = this;
      
      tinymce.init({ 
        target: this.$el.children[0],
        setup: function (editor) {
          editor.on('Change keyup undo', function (e) {
            component.updateValue(editor.getContent());
          })
        }
      });
    }
});