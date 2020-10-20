<template>
<main class="container">
  <section class="row align-items-center border border-secondary">
    <div class="input-group">
      <span class="input-group-text">Class Name</span>
      <input type="text" v-model="myClassName" class="form-control" />
    </div>
    <div class="input-group">
      <span class="input-group-text">Name Students Will See</span>
      <input type="text" v-model="myClassDisplayName" class="form-control" />
    </div>
  </section>

  <div class="row align-items-center border border-secondary">
    <p v-if="students.length < 1" class="text-center">
      No Students added to this class yet.
    </p>
    <section v-for="(student, studentIndex) in students" :key="studentIndex" class="card">
      <div class="card-body">

        <div class="input-group">
          <input type="text" v-model="student.name" class="form-control" />
          <button class="btn btn-dark" @click="toggleRuleMenu(student)"
            :disabled="addRuleIsDisabled">
            Add Rule
          </button>
          <button class="btn btn-warning" @click="removeStudentClick(student)">Delete</button>
        </div>

        <div v-if="showClassMates && student.name === activeStudent.name">
          <span v-for="(classMate, classMateIndex) of classMates" :key="classMateIndex"
            @click="addClassMateToRules(student, classMate)"
            class="badge rounded-pill bg-primary m-3 p-2 clickable">
            {{ classMate.name }}
          </span>
        </div>

        <div v-for="(rule, ruleIndex) of student.rules" :key="ruleIndex"
          class="d-flex justify-content-between align-items-center mt-2">
          <active-rule-display v-bind:class-mate="rule.classMate"
            v-bind:rule-type="rule.type">
          </active-rule-display>
          <button class="btn btn-warning" @click="removeRule(student, rule)">Remove Rule</button>
        </div>

      </div>
    </section>
    <button class="btn btn-primary" @click="addStudent()">Add Student</button>
  </div>

  <confirm-modal v-on:close-modal="modalClose($event)" v-if="showConfirmModal"></confirm-modal>
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
    };
  },
  computed: {
    addRuleIsDisabled() {
      return this.students.length < 2;
    },
    classMates() {
      return this.students.filter(student => {
        return student.name !== this.activeStudent.name;
      });
    },
  },
  created() {
    this.myClassId = this.$route.params.myClassId;
    this.getClass();
    this.setPreviousStudentId();
  },
  methods: {
    addClassMateToRules(student, classMate) {
      student.rules.push({
        type: 'separate',
        classMate: classMate.name,
        classMateId: classMate.id,
      });
      classMate.rules.push({
        type: 'separate',
        classMate: student.name,
        classMateId: student.id,
      });

      this.toggleRuleMenu();
    },
    addStudent() {
      const newStudent = {
        name: '',
        rules: [],
        id: this.getNextId(),
      };
      this.students.push(newStudent);
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
    getNextId() {
      const nextId = this.previousStudentId;
      this.previousStudentId++;
      return nextId;
    },
    modalClose(confirm) {
      if (confirm) {
        this.students = this.students.filter(student => {
          return student.name !== this.studentToRemove.name;
        });

        this.removeRulesOnClassMates();
      }

      this.showConfirmModal = false;
      this.studentToRemove = null;
    },
    setPreviousStudentId() {
      const sortedIds = this.students.map(student => {
        return parseInt(student.id);
      }).sort();

      if (sortedIds.length > 0) {
        return this.previousStudentId = sortedIds[sortedIds.length - 1];
      }
      this.setPreviousStudentId = 0;
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
  },
  // todo find a better way to autosave without deep watcher? or at least debounce it
  watch: {
    students: {
      deep: true,
      handler() {
        this.saveMyClass();
      },
    },
    myClassName() {
      this.saveMyClass();
    },
    myClassDisplayName() {
      this.saveMyClass();
    },
  },
}
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
