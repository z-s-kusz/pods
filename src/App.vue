<template>
<div id="app">
  <slide :closeOnNavigation="true" class="slider">
    <router-link to="/myClasses">My Classes</router-link>
    <router-link to="/about">About</router-link>
  </slide>
  <!-- inline styled to get around the vue css preloader breaking compile because this
  very new css is 'not valid' when added to the css -->
  <h1 class="text-center margin-top-hamburger fancy-text"
    style="{
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
    }">Group Randomizer</h1>
  <router-view/>
</div>
</template>

<script>
import { Slide } from 'vue-burger-menu';
export default {
  components: {
    Slide,
  },
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500&display=swap');

* {
  font-family: 'Josefin Sans', sans-serif;
}
.slider {
  /* nowrap applied to keep the words from changing wrap as drawer opens
  this means links must be less than 20 characters to fit!!! */
  white-space: nowrap;
}
.margin-top-hamburger {
  margin-top: 36px;
}
.fancy-text {
  background: linear-gradient(25deg, #fd7e14 40%, #0d6efd 60%);
}
</style>
