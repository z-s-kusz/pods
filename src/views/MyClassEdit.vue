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
        </div>
        <div v-for="(rule, ruleIndex) of student.rules" :key="ruleIndex">
          {{ rule.name }} | {{ rule.affects }}
        </div>
      </div>
    </section>
    <button class="btn btn-primary" @click="addStudent()">Add Student</button>
  </div>
</main>
</template>

<script>
// rule.name -- name of the rule type e.g. 'cant be with', 'must be with'
// rule.affects -- name of the affected other student
// e.g. on Nathans rule that he cant pair with Jake, Jake would be listed as rule.affects.
// and on Jakes rule, Nathen would be listed as rule.affects
export default {
  name: 'MyClass',
  data() {
    return {
      myClassId: '',
      myClassName: '',
      myClassDisplayName: '',
      students: [],
    };
  },
  created() {
    this.myClassId = this.$route.params.myClassId;
    this.getClass();
  },
  methods: {
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
        return console.error('Error, no class found in localstorgae');
      }
      const myClass = JSON.parse(myClassJSON);
      this.myClassName = myClass.myClassName;
      this.myClassDisplayName = myClass.myClassDisplayName;
      this.students = myClass.students;
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
</style>
