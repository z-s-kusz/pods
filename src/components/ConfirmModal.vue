<template>
  <transition name="modal">
    <div class="pods-modal-mask" @click="maskClick($event)">
      <div class="pods-modal-wrapper">
        <div class="pods-modal-container text-center">

          <div class="pods-modal-header">
            <h3 name="header">
              Confirm Action
            </h3>
          </div>

          <div class="pods-modal-body">
            <span name="body" v-html="body">
              You sure about that?
            </span>
          </div>

          <div class="pods-modal-footer d-flex justify-content-center">
            <button class="btn btn-primary m-2" @click="$emit('close-modal', true)">
              Confirm
            </button>
            <button class="btn btn-dark m-2" @click="$emit('close-modal', false)">
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    header: String,
    body: String,
    footer: String,
    closeOnOutsideClick: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    maskClick($event) {
      if (this.closeOnOutsideClick && $event.target.className === 'pods-modal-wrapper') {
        this.$emit('close-modal', false);
      }
    },
  },
}
</script>

<style scoped>
.pods-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.pods-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.pods-modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.pods-modal-body {
  margin: 20px 0;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .pods-modal-container,
.modal-leave-active .pods-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
span {
  text-align: left;
}
</style>
