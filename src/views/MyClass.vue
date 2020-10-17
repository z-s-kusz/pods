<template>
<main class="container">
  <div class="d-flex align-items-center mt-2 mb-2">
    <h3 class="fbf mr-2">{{ myClassDisplayName }}</h3>
    <button class="fbf btn btn-primary" @click="assignToGroups()">{{ createGroupsButton }}</button>
    <div class="fbf input-group ml-2">
      <select class="form-select" v-model="numberOfGroups">
        <span># of Groups</span>
        <option v-for="(option, i) in numberOfGroupsOptions" :key="i" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>

  <div v-if="studentsAreGrouped" class="d-flex justify-content-evenly border border-primary">
    <div v-for="(group, groupIndex) in groups" :key="groupIndex"
      class="border d-flex flex-column">
      <div>{{ group.name }}</div>
      <span v-for="(student, studentIndex) in group.students" :key="studentIndex"
        class="badge rounded-pill bg-primary m-3 p-2">
        {{ student.name }}
      </span>
    </div>
  </div>

  <div v-else class="d-flex border border-primary">
    <span v-for="student in students" :key="student.name"
      class="badge rounded-pill bg-primary m-3 p-2">
      {{ student.name }}
    </span>
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
    this.getClass();
    this.createGroupObjects();
  },
  // rule is {type: 'seperate', classMate: 'Jack'}[]
  methods: {
    assignToGroups() {
      this.clearGroups();

      let groupIndex = 0;
      this.students.forEach(student => {
        this.groups[groupIndex].students.push(student);
        groupIndex = this.getNextGroupIndex(groupIndex);
      });
      this.studentsAreGrouped = true;
    },
    createGroupObjects() {
      this.groups = [];
      for (let i = 0; i < this.numberOfGroups; i++) {
        this.groups.push({
          name: `Group ${i + 1}`,
          students: [],
        });
      }
    },
    clearGroups() {
      if (this.studentsAreGrouped) {
        this.groups.forEach(group => {
          group.students = [];
        });
      }
    },
    getClass() {
      const myClassJSON = localStorage.getItem(`myClass_${this.myClassId}`);
      if (!myClassJSON) {
        return console.error('Error getting myClass data');
      }
      const myClass = JSON.parse(myClassJSON);
      this.myClassDisplayName = myClass.myClassDisplayName;
      this.students = this.shuffleArray(myClass.students);
    },
    getNextGroupIndex(index) {
      index++;
      if (index < this.numberOfGroups) return index;
      else return 0;
    },
    getRandomIndex(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    shuffleArray(array) {
      let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    },
  },
  watch: {
    numberOfGroups() {
      this.createGroupObjects();
      this.studentsAreGrouped = false;
    },
  },
}
</script>

<style scoped>
/* bootstrap override to get flexbox centering to work in top row :) / (: */
h3 {
  margin-top: 0;
  margin-bottom: 0;
}
/* forget bootstrap flexbox */
.fbf {
  flex: 1 0 0%;
}
</style>
