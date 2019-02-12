<template>
  <div>
    <div class="heading">
      <h1>CKEditor v4 & Vue.js v2</h1>
      <h4>Playing around with a custom Vue CKEditor component.</h4>
    </div>

    <div class="container" id="app">
      <div class="form-group">
        <ckeditor v-model="content"></ckeditor>
      </div>

      <div class="form-group">
        <h4>
          CKEditor's Content
          <sup>
            <span class="label label-primary">LIVE</span>
          </sup>
        </h4>
        <div v-html="content"></div>
      </div>

      <div class="form-group">
        <h4>
          CKEditor's HTML
          <sup>
            <span class="label label-primary">LIVE</span>
          </sup>
        </h4>
        <div v-text="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Ckeditor from 'ckeditor'
import VueCkeditor from 'vue-ckeditor2'
export default {
  props: {
    value: {
      type: String
    },
    id: {
      type: String,
      default: 'editor'
    },
    height: {
      type: String,
      default: '90px'
    },
    toolbar: {
      type: Array,
      default: () => [
        ['Undo', 'Redo'],
        ['Bold', 'Italic', 'Strike'],
        ['NumberedList', 'BulletedList'],
        ['Cut', 'Copy', 'Paste']
      ]
    },
    language: {
      type: String,
      default: 'en'
    },
    extraplugins: {
      type: String,
      default: ''
    }
  },
  beforeUpdate() {
    const ckeditorId = this.id
    if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
      CKEDITOR.instances[ckeditorId].setData(this.value)
    }
  },
  mounted() {
    const ckeditorId = this.id
    console.log(this.value)
    const ckeditorConfig = {
      toolbar: this.toolbar,
      language: this.language,
      height: this.height,
      extraPlugins: this.extraplugins
    }
    CKEDITOR.replace(ckeditorId, ckeditorConfig)
    CKEDITOR.instances[ckeditorId].setData(this.value)
    CKEDITOR.instances[ckeditorId].on('change', () => {
      let ckeditorData = CKEDITOR.instances[ckeditorId].getData()
      if (ckeditorData !== this.value) {
        this.$emit('input', ckeditorData)
      }
    })
  },
  destroyed() {
    const ckeditorId = this.id
    if (CKEDITOR.instances[ckeditorId]) {
      CKEDITOR.instances[ckeditorId].destroy()
    }
  }
}
</script>
