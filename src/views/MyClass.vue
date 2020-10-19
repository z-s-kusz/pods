<template>
<main class="container">

  <div class="d-flex align-items-center mt-2 mb-2">
    <h3 class="fbf mr-2">{{ myClassDisplayName }}</h3>
    <div class="fbf input-group">
      <span class="input-group-text">Number of Groups</span>
      <select class="form-select" v-model="numberOfGroups">
        <option v-for="(option, i) in numberOfGroupsOptions" :key="i" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <button class="fbf btn btn-dark ml-2" @click="assignToGroups()">{{ createGroupsButton }}</button>
  </div>

  <div v-if="studentsAreGrouped" class="d-flex justify-content-evenly border border-dark rounded p-3">
    <div v-for="(group, groupIndex) in groups" :key="groupIndex"
      class="border d-flex flex-column">
      <div class="text-center m-2">{{ group.name }}</div>
      <span v-for="(student, studentIndex) in group.students" :key="studentIndex"
        class="badge rounded-pill bg-primary m-3 p-3 h3">
        {{ student.name }}
      </span>
    </div>
  </div>

  <div v-else class="d-flex border border-primary">
    <span v-for="student in students" :key="student.name"
      class="badge rounded-pill bg-primary m-3 p-3 h3">
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
      return this.studentsAreGrouped ? 'Regroup' : 'Create Groups!';
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
      if (this.studentsAreGrouped) {
        this.students = this.shuffleArray(this.students);
        this.clearGroups();
      }

      let groupIndex = 0;
      const studentsWithRules = [];
      const studentsNoRules = [];
      this.students.forEach(student => {
        if (student.rules.length > 0) studentsWithRules.push(student);
        else studentsNoRules.push(student);
      });

      studentsWithRules.forEach(student => {
        let group = this.groups[groupIndex];
        let studentCanGoInGroup = this.studentCanGoInGroup(student, group);
        let groupsChecked = 1;

        // loop through groups until you find one the student can go into
        // if every group is looped through and no valid groups are identified just drop the kid in anyway
        while (!studentCanGoInGroup && groupsChecked <= this.numberOfGroups) {
          groupIndex = this.getNextGroupIndex(groupIndex);
          group = this.groups[groupIndex];
          studentCanGoInGroup = this.studentCanGoInGroup(student, group);
          groupsChecked++;
        }

        group.students.push(student);
        groupIndex = this.getNextGroupIndex(groupIndex);
      });

      studentsNoRules.forEach(student => {
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
      this.groups.forEach(group => {
        group.students = [];
      });
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
    studentCanGoInGroup(student, group) {
      let studentCanGoInGroup = true;

      student.rules.forEach(rule => {
        // these are inverse rules so it looks like this code could be DRYed up. however...
        // future rules may have different uses besides pairing
        // so I want to keep each if statment's logic appart
        if (rule.type === 'separate') {
          const isPaired = group.students.find(classMate => {
            return classMate.name === rule.classMate;
          });
          if (isPaired) studentCanGoInGroup = false;
        } else if (rule.type === 'paired') {
          const isPaired = group.students.find(classMate => {
            return classMate.name === rule.classMate;
          });
          if (!isPaired) studentCanGoInGroup = false;
        }
      });

      return studentCanGoInGroup;
    }
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
