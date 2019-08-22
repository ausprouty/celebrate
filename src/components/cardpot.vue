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
          <p>Images contain Titles</p>
        </label>
        <BaseSelect
          label="Text Direction"
          :options="direction"
          v-model="language.rldir.$model"
          class="field"
        />
        <br />
        <BaseSelect
          label="Old Testament"
          :options="versions_ot"
          v-model="language.bible_ot.$model"
          class="field"
        />
        <br />

        <BaseSelect
          label="New Testament"
          :options="versions_nt"
          v-model="language.bible_nt.$model"
          class="field"
        />
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
      versions_ot: [],
      versions_nt: [],
      ot:[],
      nt:[]
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
          this.content_folders = await AuthorService.getContentFoldersForLanguage()
        }
      }
    }
  },
  async created() {
    // see https://stackoverflow.com/questions/35748162/how-to-get-the-text-of-the-selected-option-using-vuejs

    this.image_folders = await AuthorService.getFoldersImages()
    // console.log(this.image_folders)
    this.content_folders = await AuthorService.getContentFoldersForLanguage()
    // console.log(this.content_folders)
    this.ot = await this.getBibleVersions(this.language.iso.$model, 'OT')
    var versions = []
    var arrayLength = this.ot.length
    for (var i = 0; i < arrayLength; i++) {
      versions[i] = this.ot[i].volume_name
    }
    this.versions_ot = versions.sort()

    this.nt = await this.getBibleVersions(this.language.iso.$model, 'NT')
    versions = []
    arrayLength = this.nt.length
    for (i = 0; i < arrayLength; i++) {
      versions[i] = this.nt[i].volume_name
    }
    this.versions_nt = versions.sort()
  }
}
</script>
