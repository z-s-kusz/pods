<template>
<main class="container">

  <div class="d-flex align-items-center mt-2 mb-2">
    <h3 class="fbf text-center mr-2">{{ myClassName }}</h3>
    <div class="fbf input-group">
      <span class="input-group-text">Number of Groups</span>
      <select class="form-select" v-model="numberOfGroups">
        <option v-for="(option, i) in numberOfGroupsOptions" :key="i" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <button class="fbf btn btn-dark ml-2" @click="assignToGroups()">Create Groups!</button>
  </div>

  <transition name="from-right-bounce">
    <div v-if="studentsAreGrouped" key="if"
      class="d-flex flex-wrap justify-content-evenly border border-dark rounded">
      <div v-for="(group, groupIndex) in groups" :key="groupIndex"
        class="border border-dark rounded m-3">
        <div class="text-center m-2">{{ group.name }}</div>
        <draggable :list="group.students" class="d-flex flex-column" group="students">
          <span v-for="student in group.students" :key="student.id"
            class="badge rounded-pill bg-primary bg-gradient m-3 p-3">
            {{ student.name }}
          </span>
        </draggable>
      </div>
    </div>

    <div v-else class="d-flex flex-wrap justify-content-center border border-primary" key="else">
      <span v-for="student in students" :key="student.id"
        class="badge rounded-pill bg-primary m-3 p-3 h3">
        {{ student.name }}
      </span>
    </div>
  </transition>
</main>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'MyClass',
  components: {
    draggable,
  },
  data() {
    return {
      myClassId: '',
      myClass: null,
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
    myClassName() {
      if (this.myClass) {
        return this.myClass.myClassDisplayName || this.myClass.myClassName;
      } else {
        return 'My Class';
      }
    }
  },
  created() {
    this.myClassId = this.$route.params.myClassId;
    this.getClass();
    this.createGroupObjects();
  },
  beforeRouteUpdate(to, from) {
    this.myClassId = to.params.myClassId;
    this.getClass();
    this.createGroupObjects();
  },
  // rule is {type: 'seperate', classMate: 'Jack', classMateId: '3' }[]
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
      this.myClass = JSON.parse(myClassJSON);
      this.students = this.shuffleArray(this.myClass.students);
    },
    getNextGroupIndex(index) {
      index++;
      if (index < this.numberOfGroups) return index;
      else return 0;
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
            return classMate.id === rule.classMateId;
          });
          if (isPaired) studentCanGoInGroup = false;
        } else if (rule.type === 'paired') {
          const isPaired = group.students.find(classMate => {
            return classMate.id === rule.classMateId;
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
.badge {
  font-size: 1rem;
}

.from-right-bounce-enter-active {
  transition: transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.from-right-bounce-enter {
  transform: translateX(-100%);
}
</style>
