<template>
<main class="container mb-3">
  <section class="row align-items-center mb-3">
    <div class="input-group mb-2">
      <span class="input-group-text">Class Name</span>
      <input type="text" v-model="myClassName" class="form-control" v-on:input="classNameInput()" />
    </div>
    <div class="input-group">
      <span class="input-group-text">Name Students Will See</span>
      <input type="text" v-model="myClassDisplayName" class="form-control" v-on:input="classNameInput()" />
    </div>
  </section>
  <button class="btn btn-dark" type="button" @click="toggleHelp()">Toggle Help</button>
  <div v-show="showHelp" class="mt-3">
  <h6>Adding Rules</h6>
    <p>Click '( + )' to make the students pair together. The group generator will
        prioritize keeping these students grouped</p>
    <p>Click '( - )' to keep the students separated. The generator will prioritize
      keeping these students apart during grouping</p>
    <p>More rules may result in frequently unbalanced groups being generated.</p>
    <p>If the rules are impossible to follow the generator will place students into
      groups that break the rules so no student is left out.</p>
    <p>You can drag and drop students to different groups after they are
      made or keep trying to generate groups until they fit.
    </p>
  </div>
  <!-- empty v-on:submit allows us to call the addStudent button on 'enter' 
    make sure any new buttons get type="button" so they are not called on submit -->
  <form class="align-items-center" v-on:submit.prevent="">
    <p v-if="students.length < 1" class="text-center">
      No Students added to this class yet.
    </p>
    <section v-for="student in students" :key="student.id" class="card mb-3">
      <div class="card-body">

        <div class="input-group">
          <input type="text" v-model="student.name" class="form-control"
            ref="studentInput" />
          <button class="btn btn-dark" @click="toggleRuleMenu(student)"
            type="button"
            :disabled="addRuleIsDisabled">
            Add Rule
          </button>
          <button class="btn btn-warning" @click="removeStudentClick(student)" type="button">Delete</button>
        </div>

        <div v-if="showClassMates && student.name === activeStudent.name">
          <div v-for="(classMate, classMateIndex) of classMates" :key="classMateIndex"
            class="rule-container badge bg-primary m-3 p-2">
            <div class="h4 clickable"
              @click="addClassMateToRules(student, classMate, 'pair')">
              ( + )
            </div>
            <span>{{ classMate.name }}</span>
            <div class="h4 clickable"
              @click="addClassMateToRules(student, classMate, 'separate')">
              ( - )
            </div>
          </div>
        </div>

        <div v-for="(rule, ruleIndex) of student.rules" :key="ruleIndex"
          class="d-flex justify-content-between align-items-center mt-2">
          <active-rule-display v-bind:class-mate="rule.classMate"
            v-bind:rule-type="rule.type">
          </active-rule-display>
          <button class="btn btn-warning" @click="removeRule(student, rule)"
            type="button">Remove Rule</button>
        </div>

      </div>
    </section>
    <button class="btn btn-primary" @click="addStudent()" type="submit">Add Student</button>
  </form>

  <confirm-modal v-on:close-modal="deleteConfirm($event)" v-if="showConfirmModal"></confirm-modal>
</main>
</template>

<script>
// rule.type -- name of the rule type e.g. 'cant be with', 'must be with'
// rule.classMate -- name of the affected other student
// e.g. on Nathans rule that he cant pair with Jake, Jake would be listed as rule.classMate
// and on Jakes rule, Nathen would be listed as rule.classMate
// both would have rule.type = 'separate'
import ActiveRuleDisplay from '@/components/ActiveRuleDisplay.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import classListService from '@/services/ClassListService';

export default {
  name: 'MyClass',
  components: {
    ActiveRuleDisplay,
    ConfirmModal,
  },
  data() {
    return {
      myClassId: '',
      myClassName: '',
      myClassDisplayName: '',
      students: [],
      activeStudent: null,
      showClassMates: false,
      showConfirmModal: false,
      studentToRemove: null,
      previousStudentId: 0,
      showHelp: false,
    };
  },
  computed: {
    addRuleIsDisabled() {
      return this.students.length < 2;
    },
    classMates() {
      return this.students.filter(student => {
        const isAlreadyInRules = this.activeStudent.rules.find(rule => {
          return rule.classMateId === student.id;
        });
        return student.id !== this.activeStudent.id && !isAlreadyInRules;
      });
    },
  },
  created() {
    this.myClassId = this.$route.params.myClassId;
    this.getClass();
    this.setPreviousStudentId();
  },
  methods: {
    addClassMateToRules(student, classMate, type) {
      student.rules.push({
        type,
        classMate: classMate.name,
        classMateId: classMate.id,
      });
      classMate.rules.push({
        type,
        classMate: student.name,
        classMateId: student.id,
      });

      this.toggleRuleMenu();
    },
    addStudent() {
      const newStudent = {
        name: '',
        rules: [],
        id: this.previousStudentId + 1,
      };
      this.previousStudentId++;
      this.students.push(newStudent);
      setTimeout(() => {
        this.focusNewStudentEntry();
      }, 50);
    },
    classNameInput() {
      this.saveMyClass();
      this.saveMyClassInService();
    },
    getClass() {
      const myClassJSON = localStorage.getItem(`myClass_${this.myClassId}`);
      if (!myClassJSON) {
        return console.error('Error, myclass not found in local storage');
      }
      const myClass = JSON.parse(myClassJSON);
      this.myClassName = myClass.myClassName;
      this.myClassDisplayName = myClass.myClassDisplayName;
      this.students = myClass.students;
    },
    deleteConfirm(confirm) {
      if (confirm) {
        this.students = this.students.filter(student => {
          return student.id !== this.studentToRemove.id;
        });

        this.removeRulesOnClassMates();
      }

      this.showConfirmModal = false;
      this.studentToRemove = null;
    },
    focusNewStudentEntry() {
      const inputArray = this.$refs.studentInput;
      const lastInputIndex = inputArray.length - 1;
      inputArray[lastInputIndex].focus();
    },
    setPreviousStudentId() {
      const sortedIds = this.students.map(student => {
        return parseInt(student.id);
      }).sort((a, b) => a - b);

      if (sortedIds.length > 0) {
        return this.previousStudentId = sortedIds[sortedIds.length - 1];
      }
      this.setPreviousStudentId = 0;
    },
    toggleHelp() {
      this.showHelp = !this.showHelp;
    },
    toggleRuleMenu(student) {
      if (student) {
        this.showClassMates = true;
        this.activeStudent = student;
      } else {
        this.showClassMates = false;
        this.activeStudent = null;
      }
    },
    removeRule(student, ruleToRemove) {
      // find associated classmate and remove corresponding rule
      const classMate = this.students.find(findStudent => {
        return findStudent.id === ruleToRemove.classMateId;
      });
      classMate.rules = classMate.rules.filter(rule => {
        return rule.classMateId !== student.id;
      });

      // remove rule from selected student
      student.rules = student.rules.filter(rule => {
        return rule.classMateId !== ruleToRemove.classMateId;
      });
    },
    // when a student is removed they might be listed as the subject of a rule on another student,
    // removeRulesOnClassMates() finds and deletes those references to the now deleted student
    removeRulesOnClassMates() {
      this.studentToRemove.rules.forEach(rule => {
        this.students.find(classMate => {
          if (classMate.id === rule.classMateId) {
            classMate.rules = classMate.rules.filter(filterRule => {
              return filterRule.classMateId !== this.studentToRemove.id;
            });
            return true;
          }
          return false;
        });
      });
    },
    removeStudentClick(student) {
      this.studentToRemove = student;
      this.showConfirmModal = true;
    },
    saveMyClass() {
      const classJSON = JSON.stringify({
        myClassId: this.myClassId,
        myClassName: this.myClassName,
        myClassDisplayName: this.myClassDisplayName,
        students: this.students,
      });
      localStorage.setItem(`myClass_${this.myClassId}`, classJSON);
    },
    saveMyClassInService() {
      classListService.updateClass({
        myClassId: this.myClassId,
        myClassName: this.myClassName,
        myClassDisplayName: this.myClassDisplayName,
        students: this.students,
      });
    },
  },
  // todo find a better way to autosave without deep watcher? or at least debounce it
  watch: {
    students: {
      deep: true,
      handler() {
        this.saveMyClass();
      },
    },
  },
}
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
.clickable:nth-child(3) {
  margin-bottom: 0;
  margin-top: .5rem
}
.rule-container .h4 {
  font-family: monospace;
}
</style>
