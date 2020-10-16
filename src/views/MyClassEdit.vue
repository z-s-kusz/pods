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
          <button class="btn btn-dark"
            @click="toggleRuleMenu(student)" :disabled="addRuleIsDisabled">
            Add Rule
          </button>
        </div>

        <div v-if="showClassMates && student.name === activeStudent.name">
          <span v-for="(classMate, classMateIndex) of classMates" :key="classMateIndex"
            @click="addClassMateToRules(student, classMate)"
            class="badge rounded-pill bg-primary m-3 p-2 clickable">
            {{ classMate.name }}
          </span>
        </div>
        <!-- todo make a component that will write the rules in plain english
        ie instead of 'separate: Jake' show 'Keep separated from Jake.' -->
        <div v-for="(rule, ruleIndex) of student.rules" :key="ruleIndex">
          <span class="mr-4">{{ rule.type }}: {{ rule.classMate }}</span>
          <button class="btn btn-warning" @click="removeRule(student, rule)">Remove Rule</button>
        </div>
      </div>
    </section>
    <button class="btn btn-primary" @click="addStudent()">Add Student</button>
  </div>
</main>
</template>

<script>
// rule.type -- name of the rule type e.g. 'cant be with', 'must be with'
// rule.classMate -- name of the affected other student
// e.g. on Nathans rule that he cant pair with Jake, Jake would be listed as rule.classMate
// and on Jakes rule, Nathen would be listed as rule.classMate
// both would have rule.type = 'separate'
export default {
  name: 'MyClass',
  data() {
    return {
      myClassId: '',
      myClassName: '',
      myClassDisplayName: '',
      students: [],
      activeStudent: null,
      showClassMates: false,
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
  },
  methods: {
    addClassMateToRules(student, classMate) {
      student.rules.push({
        type: 'separate',
        classMate: classMate.name,
      });
      classMate.rules.push({
        type: 'separate',
        classMate: student.name,
      });

      this.toggleRuleMenu();
      this.saveMyClass();
    },
    addStudent() {
      const newStudent = {
        name: '',
        rules: [],
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
        return findStudent.name === ruleToRemove.classMate;
      });
      classMate.rules = classMate.rules.filter(rule => {
        return rule.classMate !== student.name;
      });

      // remove rule from selected student
      student.rules = student.rules.filter(rule => {
        return rule.classMate !== ruleToRemove.classMate;
      });

      this.saveMyClass();
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
