<template>
  <div>
    <input type="text" v-model="newTodoItem" v-on:keyup.enter="addTodo" />
    <button v-on:click="addTodo">+</button>
    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">🧐</h3>
      <div slot="body">
        아무것도 입력하지 않으셨네요!
        <div>
          <button @click="showModal = false">❌</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "./common/Modal.vue";

export default {
  data: () => {
    return {
      newTodoItem: "",
      showModal: false,
    };
  },

  methods: {
    addTodo() {
      if (this.newTodoItem !== "") {
        this.$emit("addTodoItem", this.newTodoItem);
        this.clearInput();
      } else {
        this.showModal = !this.showModal;
      }
    },
    clearInput() {
      this.newTodoItem = "";
    },
  },

  components: { Modal: Modal },
};
</script>

<style>
</style>