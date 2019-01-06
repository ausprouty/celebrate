<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        <img class="menu_icon" alt="Home" src="../src/assets/header1.png">
      </router-link>
      <br>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  text-align: left;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

img.menu_icon {
  height: 64px;
}
</style>
