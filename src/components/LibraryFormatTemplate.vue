<template>
  <div class="app-card -shadow">
    <h2>Library Setup</h2>
    <div>
      <h3>Library Image</h3>
      <v-select :options="images" label="title" v-model="format.image">
        <template slot="option" slot-scope="option">
          <img :src="option.image" />
          {{ option.title }}
        </template>
      </v-select>
    </div>
    <div>
      <input type="checkbox" id="checkbox" v-model="format.no_ribbon" />
      <label for="checkbox">
        <p>Image contains back button image</p>
      </label>
    </div>

    <br />
    <br />

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
      <p>Back Button for Chapters</p>
      <v-select
        :options="back_buttons"
        label="title"
        v-model="format.back_button"
      >
        <template slot="option" slot-scope="option">
          <img :src="option.image" />
          {{ option.title }}
        </template>
      </v-select>
    </div>

    <div v-if="image_permission">
      <div v-if="format.back_button">
        <img v-bind:src="option.image" class="header" />
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
import { mapState } from 'vuex'
import '@/assets/css/vueSelect.css'
import AuthorService from '@/services/AuthorService.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'

export default {
  props: {
    format: Object
  },
  computed: mapState(['appDir']),
  mixins: [bookMarkMixin, authorMixin, libraryMixin],
  components: {
    'v-select': vSelect
  },
  data() {
    return {
      images: [],
      image_dir: null,
      image_permission: false,
      styles: [],
      style_error: false,
      option: [],
      options: [],
      back_buttons: []
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
          //   this.saveForm('stay')
          //  this.showForm()
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
          // this.saveForm('stay')
          // this.showForm()
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
    // get styles, images and back_buttons
    var style = await AuthorService.getStyles(param)
    if (typeof style !== 'undefined') {
      this.styles = style
    }
    this.images = await this.getImages(this.bookmark.language.image_dir)
    this.back_buttons = await this.getImages('ZZ/images/ribbons')
  }
}
</script>
<style scoped>
img {
  width: 50%;
  max-width: 200px;
}
</style>
