<template>
<main class="container">
  <div class="row">
    <div class="col-sm">Class: {{ myClassDisplayName }}</div>
    <div class="col-sm">
      <button class="btn btn-primary">{{ createGroupsButton }}</button>
    </div>
    <div class="col-sm">
      <select class="form-select">
        <option v-for="(option, i) in nuberOfGroupsOptions" :key="i" :value="numberOfGroups">
          {{ option }}
        </option>
      </select>
    </div>
  </div>

  <div v-if="!studentsAreGrouped">

  </div>
  <div v-else class="d-flex border border-primary">
    <div v-for="student in students" :key="student.id">{{ student.name }}</div>
  </div>

</main>
</template>

<script>
export default {
  name: 'MyClass',
  data() {
    return {
      myClassId: '',
      myClassDisplayName: '',
      students: [],
      groups: [],
      numberOfGroups: 2,
      numberOfGroupsOptions: [
        2, 3, 4, 5, 6, 7, 8,
      ],
      studentsAreGrouped: false,
    };
  },
  computed: {
    createGroupsButton() {
      return this.studentsAreGrouped ? 'Rearange' : 'Create Groups';
    },
  },
  created() {
    this.myClassId = this.$route.params.myClassId;
  },
  methods: {
    getClass() {
      localStorage.getItem(`class-${this.myClassId}`)
    },
  },
}
</script>

<style scoped>
</style>
