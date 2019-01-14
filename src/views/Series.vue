<template>
  <h1>This is the index page for {{series}} series</h1>
</template>
$
<script>
export default {
  props: ['folder', 'series']
}
</script>

<style>
</style>

<template>
  <div>
    <h1>This is the index page for {{series}} series</h1>
    <Book v-for="chapter in book" :key="chapter.id" :book="chapter"/>
  </div>
</template>


<script>
export default {
  props: ['folder', 'series']
}
</script>
