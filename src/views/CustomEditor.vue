<template>
  <div>
    <NavBar/>

    <link rel="stylesheet" v-bind:href="'/css/' + this.style">
    <p>
      <vue-ckeditor v-model="content" :config="config"/>
    </p>
    <p>
      Please compare to
      <a
        target="a_blank"
        href="/page/AU/eng/basics/basics101"
      >/page/AU/eng/basics/basics101</a>
    </p>
  </div>
</template>


<script>
import NavBar from '@/components/NavBarAdmin.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'

export default {
  components: {
    NavBar,
    VueCkeditor
  },
  props: ['css'],
  data() {
    return {
      style: 'AU-myfriends.css',
      content: 'this is my test',
      config: {
        extraPlugins: 'bidi',
        toolbarGroups: [
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
        ],
        height: 300
      },
      htmlTextx: 'this is the text we use'
    }
  }
}
</script>
<style >
</style>
