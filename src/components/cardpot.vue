<template>
  <div class="app-card -shadow">
    <h2>Library Setup</h2>
     <div>
      <h3>Library Image</h3>
      <v-select :options="options" label="title">
        <template slot="option" slot-scope="option">
          <img :src="option.image" />
        </template>
      </v-select>
    </div>
    <div>
      <input type="checkbox" id="checkbox" v-model="format.replace_header" />
      <label for="checkbox">
        <p>Image replaces Navigation Header</p>
      </label>
    </div>
   
    <br />
    <br />
    <div>
      <BaseSelect
        label="Libary Image:"
        :options="images"
        v-model="format.image"
        class="field"
      />
    </div>
    <div v-if="image_permission">
      <label>
        Add new Image&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="file"
          v-bind:id="format.image"
          ref="imageHeader"
          v-on:change="handleHeaderUpload(image)"
        />
      </label>
    </div>

    <div>
      <br />
      <br />
      <BaseSelect
        label="Library Style Sheet:"
        :options="styles"
        v-model="format.style"
        class="field"
      />
      <template v-if="style_error">
        <p class="errorMessage">Only .css files may be uploaded</p>
      </template>

      <label>
        Add new stylesheet&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="file"
          v-bind:id="format.style"
          ref="style"
          v-on:change="handleStyleUpload(format.style)"
        />
      </label>
    </div>
    <div>
      <br />
      <br />
      <BaseSelect
        label="Back Button for Chapters:"
        :options="images"
        v-model="format.back_button"
        class="field"
      />
    </div>
    <div v-if="image_permission">
      <div v-if="format.back_button">
        <img
          v-bind:src="
            appDir.library + image_dir + '/' + this.format.back_button
          "
          class="header"
        />
      </div>
      <label>
        Add new Image&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="file"
          v-bind:id="format.back_button"
          ref="imageBackButton"
          v-on:change="handleBackButtonUpload(format.back_button)"
        />
      </label>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
// see https://stackoverflow.com/questions/55479380/adding-images-to-vue-select-dropdown

import '@/assets/css/vueSelect.css'
import AuthorService from '@/services/AuthorService.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'

export default {
  props: {},
  mixins: [bookMarkMixin, authorMixin],
  components: {
    'v-select': vSelect
  },
  data() {
    return {
      format: {},
      images: [],
      image_permission: false,
      styles: [],
      style_error: false,
      options: []
    }
  },
  methods: {
    handleHeaderUpload(code) {
      console.log('handleImageUpload: ' + code)
      var checkfile = {}
      checkfile = this.$refs.imageHeader['files']
      if (checkfile.length == 1) {
        console.log(checkfile)
        console.log(checkfile[0])
        var type = AuthorService.typeImage(checkfile[0])
        if (type) {
          var params = {}
          params.directory = 'content/' + this.bookmark.language.image_dir
          params.name = code
          console.log(params)
          AuthorService.imageStore(params, checkfile[0])
          var filename = checkfile[0].name
          console.log('setting this image to ' + filename)
          this.image = filename
          this.saveForm('stay')
          this.showForm()
        }
      }
    },
    handleBackButtonUpload(code) {
      console.log('handleImageUpload: ' + code)
      var checkfile = {}
      checkfile = this.$refs.imageHeader['files']
      if (checkfile.length == 1) {
        console.log(checkfile)
        console.log(checkfile[0])
        var type = AuthorService.typeImage(checkfile[0])
        if (type) {
          var params = {}
          params.directory = 'content/' + this.bookmark.language.image_dir
          params.name = code
          console.log(params)
          AuthorService.imageStore(params, checkfile[0])
          var filename = checkfile[0].name
          console.log('setting this image to ' + filename)
          this.back_button = filename
          this.saveForm('stay')
          this.showForm()
        }
      }
    }
  },
  async created() {
    await this.CheckBookmarks(this.$route.params)
    var param = {}
    param.route = JSON.stringify(this.$route.params)
    param.image_dir = this.bookmark.language.image_dir

    console.log('image dir: ' + param.image_dir.substring(0, 2))
    this.image_permission = this.authorize(
      'write',
      param.image_dir.substring(0, 1)
    )
    // get styles
    var style = await AuthorService.getStyles(param)
    if (typeof style !== 'undefined') {
      this.styles = style
    }
    // get images
    this.options = []
    var img = await AuthorService.getImages(param)

    if (typeof img !== 'undefined') {
      img.push('')
      this.images = img.sort()
      var length = img.length

      var i = 0
      for (i = 0; i < length; i++) {
        var formatted = {}
        formatted.title = img[i]
        formatted.image = '/content/' + param.image_dir + '/' + img[i]

        this.options.push(formatted)
        //console.log(pictures)
      }
    }
  }
}
</script>
<style scoped>
img {
  width: 50%;
  max-width:200px;
}
</style>
