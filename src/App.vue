<template>
<div id="app">
  <slide :closeOnNavigation="true" class="slider">
    <router-link to="/">Home it is great</router-link>
    <router-link to="/about">About</router-link>
  </slide>
  <h1 class="text-center text-indigo-500 text-3xl margin-top-hamburger">Pods</h1>
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
@import url('https://fonts.googleapis.com/css2?family=Lora&display=swap');

* {
  font-family: 'Lora', serif;
}
.slider {
  /* nowrap applied to keep the words from changing wrap as drawer opens
  this means links must be less than 20 characters to fit!!! */
  white-space: nowrap;
}
.margin-top-hamburger {
  margin-top: 28px;
}
</style>
