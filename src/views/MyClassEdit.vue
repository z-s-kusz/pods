<template>
<main class="container">
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
      localStorage.getItem(`class-${this.myClassId}`)
    },
    saveMyClass() {

    },
  },
}
</script>

<style scoped>
</style>
