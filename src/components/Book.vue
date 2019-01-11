<template>
  <router-link class="event-link" :to="{ name: topic, params: { series: book.link } }">
    <div class="event-card -shadow">
      <img v-bind:src="'/img/menu/' + book.image" class="book">
      <div class="book">
        <span class="bold">{{book.title}} {{bookmark.country}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    book: Object
  },
  computed: {
    localComputed() {
      console.log('book')
      console.log(book)
      // var correctImage = '/menu/' + this.book.image
      var correctImage = 'xxx'
      console.log(correctImage)
      return correctImage
    },
    ...mapState(['bookmark'])
  }
}
</script>

<style scoped>
img.book {
  width: 25%;
}
div.book {
  vertical-align: top;
  width: 70%;
  font-size: 24px;
  float: right;
}
.book {
  text-align: left;
}
</style>
