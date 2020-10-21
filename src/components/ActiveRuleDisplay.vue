<template>
  <li>{{ ruleText }}</li>
</template>

<script>
export default {
  props: {
    ruleType: String,
    classMate: String,
  },
  computed: {
    ruleText() {
      if (this.ruleType === 'separate') {
        return `Separated from ${this.classMate}.`;
      } else if (this.ruleType === 'pair') {
        return `Paired with ${this.classMate}.`;
      } else {
        return `${this.ruleType} | ${this.classMate}.`;
      }
    },
  },
}
</script>
