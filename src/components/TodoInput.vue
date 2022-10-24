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
        var obj = { completed: false, item: this.newTodoItem };
        console.log(this.newTodoItem);
        localStorage.setItem(this.newTodoItem, JSON.stringify(obj));
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