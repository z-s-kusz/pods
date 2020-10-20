<template>
<div id="app">
  <slide :closeOnNavigation="true" class="slider">
    <router-link to="/myClasses">Edit My Classes</router-link>
    <router-link v-for="myClass in myClasses" :key="myClass.myClassId"
      :to="`/myClass/${myClass.myClassId}`">
      {{ myClass.myClassDisplayName || myClass.myClassName }}
    </router-link>
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
  <transition name="fade-in">
    <router-view/>
  </transition>
</div>
</template>

<script>
import { Slide } from 'vue-burger-menu';
import classListService from '@/services/ClassListService';

export default {
  components: {
    Slide,
  },
  computed: {
    myClasses() {
      return classListService.store.classList;
    },
  },
  created() {
    classListService.initializeClassListFromLocalStorage();
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

.fade-in-enter-active {
  transition: opacity .5s;
}
.fade-in-enter {
  opacity: 0;
}
</style>
