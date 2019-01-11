<template>
  <router-link class="event-link" :to="{ name: 'topic', params: { series: book.link } }">
    <div class="event-card -shadow">
      <img v-bind:src="book.image" class="book">
      <div class="book">
        <span class="bold">{{book.title}}</span>
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
  computed: mapState(['bookmark'])
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
