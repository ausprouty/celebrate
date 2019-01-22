<template>
<div>
<img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">
<h1>Choose Language</h1>
<Language v-for="language in languages" :key="language.iso" :language="language"/>
<div class = "version">
Version 1.01
</div>
</div>
</template>

<script>
import Language from '@/components/Language.vue'
import DataService from '@/services/DataService.js'
import { mapState } from 'vuex'
export default {
props: ['countryCODE'],
components: {
Language
},
computed: mapState(['bookmark', 'appDir']),
data() {
return {
languages: []
}
},
created() {
var route = {}
route.country = this.countryCODE
console.log('route from Languages.vue')
console.log(route)
this.$store.dispatch('checkBookmark', route)
DataService.getLanguages(this.countryCODE)
.then(response => {
console.log(response.data) // For now, logs out the response
this.languages = response.data
if (response.data.length === 1) {
var language = response.data[0]
this.$store
.dispatch('updateBookmark', ['language', language])
.then(() => {
this.$router.push({
name: 'library',
params: {
country: this.bookmark.country.code,
folder: this.bookmark.language.iso
}
})
})
.catch(() => {
console.log('There was a problem storing language')
})
}
})
.catch(error => {
console.log('There was an error:', error.response) // Logs out the error
})
}
}
</script>


<style>
</style>
