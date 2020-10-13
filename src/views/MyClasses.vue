<template>
<main class="container">
  <h1>My Classes</h1>
  <div v-for="myClass in myClasses" :key="myClass.myClassId" class="card">
    <div class="card-body">
      <router-link :to="`myClass/${myClass.myClassId}`">
        {{ myClass.myClassName }}
      </router-link>
      <button class="btn btn-dark" @click="goToEdit(myClass.myClassId)">Edit Class</button>
    </div>
  </div>

  <button class="btn btn-primary" @click="addNewClass()">Add New Class</button>
</main>
</template>

<script>
export default {
  name: 'MyClasses',
  data() {
    return {
      myClasses: [],
      classStorageIds: [],
    };
  },
  created() {
    this.getMyClasses();
  },
  methods: {
    addNewClass() {
      const classId = this.getNextId();
      const myClass = {
        myClassId: classId,
        myClassName: '',
        myClassDisplayName: '',
        students: [],
      };
      this.myClasses.push(myClass);
      const myClassJSON = JSON.stringify(myClass);
      const storageId = `myClass_${classId}`;
      localStorage.setItem(storageId, myClassJSON);
      this.classStorageIds.push(storageId);
      const classStorageIdsJSON = JSON.stringify(this.classStorageIds)
      localStorage.setItem('classStorageIds', classStorageIdsJSON);
    },
    getMyClasses() {
      const classesListJSON = localStorage.getItem('classStorageIds');
      if (!classesListJSON) {
        this.classStorageIds = [];
        return this.myClasses = [];
      }
      this.classStorageIds = JSON.parse(classesListJSON);
      this.classStorageIds.forEach(storageId => {
        const myClassJSON = localStorage.getItem(storageId);
        if (myClassJSON) {
          const myClass = JSON.parse(myClassJSON);
          this.myClasses.push(myClass);
        }
      });
    },
    getNextId() {
      if (this.myClasses.length < 1) {
        return '1';
      }
      const latestClass = this.myClasses[this.myClasses.length - 1];
      return parseInt(latestClass.myClassId) + 1 + '';
    },
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
