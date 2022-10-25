<template>
  <div>
    <input type="text" v-model="newTodoItem" v-on:keyup.enter="addTodo" />
    <button v-on:click="addTodo">+</button>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      newTodoItem: "",
    };
  },
  methods: {
    addTodo() {
      if (this.newTodoItem !== "") {
        this.$emit("addTodoItem", this.newTodoItem)
        this.clearInput();
      }
    },

    clearInput() {
      this.newTodoItem = "";
    },
  },
};
</script>

<style>
</style>