<template>
  <div>
    <input type="text" v-model="newTodoItem" v-on:keyup.enter="addTodo" />
    <button v-on:click="addTodo">β</button>
    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">π§</h3>
      <div slot="body">
        μλ¬΄κ²λ μλ ₯νμ§ μμΌμ¨λ€μ!
        <div>
          <button @click="showModal = false">β</button>
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
        this.$store.commit("addOneItem", this.newTodoItem);
        this.clearInput();
      } else {
        this.showModal = !this.showModal;
      }
    },
    
    clearInput() {
      this.newTodoItem = "";
    },
  },

  components: { Modal },
};
</script>

<style>
</style>