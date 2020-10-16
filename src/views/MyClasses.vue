<template>
<main class="container">
  <h1>My Classes</h1>
  <div v-for="myClass in myClasses" :key="myClass.myClassId" class="card">
    <div class="card-body d-flex justify-content-between align-items-center">
      <router-link :to="`myClass/${myClass.myClassId}`">
        {{ myClass.myClassName || 'No Name! Edit to add a name!' }}
      </router-link>
      <div>
        <button class="btn btn-dark m-2" @click="goToEdit(myClass.myClassId)">Edit</button>
        <button class="btn btn-warning m-2" @click="deleteClassClicked(myClass.myClassId)">Delete</button>
      </div>
    </div>
  </div>

  <button class="btn btn-primary" @click="addNewClass()">Add New Class</button>
  <confirm-modal v-if="showConfirmModal"
    v-on:close-modal="modalClose($event)">
  </confirm-modal>
</main>
</template>

<script>
import ConfirmModal from '@/components/ConfirmModal.vue';

export default {
  name: 'MyClasses',
  components: {
    ConfirmModal,
  },
  data() {
    return {
      activeClassId: '',
      myClasses: [],
      classStorageIds: [],
      showConfirmModal: false,
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

      this.goToEdit(classId);
    },
    deleteClass() {
      const storageId = `myClass_${this.activeClassId}`;

      this.myClasses = this.myClasses.filter(myClass => {
        return myClass.myClassId !== this.activeClassId;
      });
      localStorage.removeItem(storageId);

      this.classStorageIds = this.classStorageIds.filter(id => {
        return id !== storageId;
      });
      const classStorageIdsJSON = JSON.stringify(this.classStorageIds);
      localStorage.setItem('classStorageIds', classStorageIdsJSON);
    },
    deleteClassClicked(myClassId) {
      this.activeClassId = myClassId;
      this.showConfirmModal = true;
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
    },
    modalClose(confirm) {
      if (confirm) {
        this.deleteClass();
      }
      this.activeClassId = '';
      this.showConfirmModal = false;
    }
  },
};
</script>

<style scoped>

</style>
