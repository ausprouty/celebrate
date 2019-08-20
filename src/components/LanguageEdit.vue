<template>
  <div
    class="app-card -shadow"
    v-bind:class="{ notpublished: !language.publish.$model }"
  >
    <div
      class="float-right"
      style="cursor:pointer"
      @click="deleteLanguageForm(index)"
    >
      X
    </div>
    <form @submit.prevent="saveForm">
      <h2>Language Details</h2>
      <BaseInput
        v-model="language.name.$model"
        label="Language Name (as you want your audience to see it)"
        type="text"
        placeholder="Language Name"
        class="field"
        :class="{ error: language.name.$error }"
        @blur="language.name.$touch()"
      />
      <template v-if="language.name.$error">
        <p v-if="!language.name.required" class="errorMessage">
          Language Name is required
        </p>
      </template>

      <div v-if="!language.iso.$model">
        <p>
          <a
            target="a_blank"
            href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
            >Reference File</a
          >
        </p>
      </div>
      <BaseInput
        v-model="language.iso.$model"
        label="Language 3 letter ISO"
        type="text"
        placeholder="3 letter ISO code"
        class="field"
        :class="{ error: language.iso.$error }"
        @blur="language.iso.$touch()"
        @input="forceLowerISO(language.iso.$model)"
      />
      <template v-if="language.iso.$error">
        <p v-if="!language.iso.required" class="errorMessage">
          Language ISO is required
        </p>
      </template>
      <BaseSelect
        label="Text Direction"
        :options="direction"
        v-model="language.rldir.$model"
        class="field"
      />
      <hr />
      <h2>Content Location</h2>
      <div v-if="language.iso.$model">
        <BaseSelect
          label="Content Folder"
          :options="content_folders"
          v-model="language.folder.$model"
          class="field"
          :class="{ error: language.folder.$error }"
          @blur="language.folder.$touch()"
        />
        <div>
          <p>
            <a @click="setupLanguageFolder(language.iso.$model)"
              >Create new content folder</a
            >
          </p>
        </div>
        <template v-if="language.folder.$error">
          <p v-if="!language.folder.required" class="errorMessage">
            Content folder is required
          </p>
        </template>
      </div>
      <hr />
      <h2>Images</h2>
      <div v-if="language.folder.$model">
        <BaseSelect
          label="Library Image Folder"
          :options="image_folders"
          v-model="language.image_dir.$model"
          class="field"
          :class="{ error: language.image_dir.$error }"
          @blur="language.image_dir.$touch()"
        />

        <div>
          <p>
            <a @click="setupImageFolder(language.iso.$model)"
              >Create new image folder</a
            >
          </p>
        </div>
        <template v-if="language.image_dir.$error">
          <p v-if="!language.image_dir.required" class="errorMessage">
            Menu directory is required
          </p>
        </template>
        <input type="checkbox" id="checkbox" v-model="language.titles.$model" />
        <label for="checkbox">
          <p>Book images contain Titles</p>
        </label>
        <hr />

        <div>
          <input
            type="checkbox"
            id="checkbox"
            v-model="language.custom.$model"
          />
          <label for="checkbox">
            <h2>Custom Library Index?</h2>
          </label>
        </div>
        <hr />

        <h2>Common Terms</h2>
        <BaseInput
          v-model="language.download.$model"
          label="Download for offline use"
          type="text"
          placeholder
          class="field"
        />
        <BaseInput
          v-model="language.download_ready.$model"
          label="Ready for offline use"
          type="text"
          placeholder
          class="field"
        />
        <BaseInput
          v-model="language.read_more.$model"
          label="Read More"
          type="text"
          placeholder
          class="field"
        />
        <hr />

        <h2>Bible</h2>
        <div>
          <br />Old Testament:
          <select v-model="language.bible_ot.$model">
            <option
              v-for="o in this.ot"
              v-bind:key="o.bid"
              v-bind:value="o.bid"
              >{{ o.volume_name }}</option
            >
          </select>
        </div>

        <div>
          <br />New Testament:
          <select v-model="language.bible_nt.$model">
            <option
              v-for="n in this.nt"
              v-bind:key="n.bid"
              v-bind:value="n.bid"
              >{{ n.volume_name }}</option
            >
          </select>
        </div>

        <br />
        <input
          type="checkbox"
          id="checkbox"
          v-model="language.publish.$model"
        />
        <label for="checkbox">
          <h2>Publish?</h2>
        </label>
      </div>
    </form>
  </div>
</template>

<script>
import AuthorService from '@/services/AuthorService.js'
import { bibleMixin } from '@/mixins/BibleMixin.js'
export default {
  mixins: [bibleMixin],
  props: {
    language: Object
  },

  data() {
    return {
      image_folders: [],
      content_folders: [],
      direction: ['rtl', 'ltr'],
      ot: [],
      nt: []
    }
  },
  methods: {
    deleteLanguageForm(index) {
      this.languages.splice(index, 1)
    },
    forceLowerISO(value) {
      var change = this.$v.languages.$model
      var arrayLength = change.length
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == value) {
          this.$v.languages.$each[i].$model.iso = value.toLowerCase()
        }
      }
    },
    async setupImageFolder(iso) {
      AuthorService.setupImageFolder(this.$route.params.country_code, iso)
      console.log(this.$v.languages.$model)
      var change = this.$v.languages.$model
      var arrayLength = change.length
      // console.log(arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == iso) {
          this.$v.languages.$each[i].$model.image_dir = iso
          console.log(checkfile)
          this.image_folders = await AuthorService.getFoldersImages()
        }
      }
    },
    async setupLanguageFolder(iso) {
      AuthorService.setupLanguageFolder(
        this.$route.params.country_code,
        iso.toLowerCase()
      )
      console.log(this.$v.languages.$model)
      var change = this.$v.languages.$model
      var arrayLength = change.length
      // console.log(arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == iso) {
          this.$v.languages.$each[i].$model.image_dir = iso.toLowerCase()
          console.log(checkfile)
          this.content_folders = await AuthorService.getFoldersLanguage()
        }
      }
    }
  },
  async created() {
    // see https://stackoverflow.com/questions/35748162/how-to-get-the-text-of-the-selected-option-using-vuejs
    // see https://vue-select.org/guide/values.html#transforming-selections
    this.image_folders = await AuthorService.getFoldersImages()
    // console.log(this.image_folders)
    this.content_folders = await AuthorService.getFoldersLanguage()
    // console.log(this.content_folders)
    this.ot = await this.getBibleVersions(this.language.iso.$model, 'OT')
    console.log('OT')
    console.log(this.ot)
    this.nt = await this.getBibleVersions(this.language.iso.$model, 'NT')

    console.log('NT')
    console.log(this.nt)
  }
}
</script>
