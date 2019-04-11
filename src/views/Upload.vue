<template>
  <div>
    <input style="display:none" type="file" @change="onFileSelected" ref="fileInput">
    <button @click="$refs.fileInput.click()">Pick File</button>
    <button @click="onUpload">Upload!</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      selectedFile: null
    }
  },
  methods: {
    onFileSelected(event) {
      console.log(event)
      this.selectedFile = event.larget.files[0]
    },
    onUpload() {
      const formData = new FormData()
      formData.append('myFile', this.selectedFile, this.selectedFile.name)
      axios
        .post('my-domain.com/file-upload', formData, {
          onUploadProgress: progressEvent => {
            console.log(
              'Upload Progress: ' +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                '%'
            )
          }
        })
        .then(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
