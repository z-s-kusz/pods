<template>
<main class="container">
  <h1>My Classes</h1>
  <div v-for="myClass in myClasses" :key="myClass.id" class="card">
    <div class="card-body">
      <router-link :to="`myClass/${myClass.id}`">{{ myClass.name }}</router-link>
      <button class="btn btn-dark" @click="goToEdit(myClass.id)">Edit Class</button>
    </div>

  </div>
  <button class="btn btn-primary">Add New Class</button>
</main>
</template>

<script>
const myClasses = [
  { name: 'Group A', id: '1' },
  { name: 'Group B', id: '2' },
];
export default {
  name: 'MyClasses',
  data() {
    return {
      myClasses: [...myClasses],
    };
  },
  methods: {
    goToEdit(id) {
      this.$router.push({ 
        path: `myClasses/${id}/edit`,
      });
    }
  },
};
</script>

<style scoped>

</style>
