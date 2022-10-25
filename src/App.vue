<template>
  <div id="app">
    <TodoHeader></TodoHeader>
    <TodoInput v-on:addTodoItem="addOneItem"></TodoInput>
    <TodoList
      v-bind:propsdata="todoItems"
      v-on:removeTodoItem="removeOneItem"
      v-on:toggleItem="toggleOneItem"
    ></TodoList>
    <TodoFooter v-on:clear="clearAllItems"></TodoFooter>
  </div>
</template>

<script>
import TodoHeader from "./components/TodoHeader.vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import TodoFooter from "./components/TodoFooter.vue";

export default {
  data: () => {
    return {
      todoItems: [],
    };
  },

  methods: {
    addOneItem(todoItem) {
      var obj = { completed: false, item: todoItem };
      localStorage.setItem(todoItem, JSON.stringify(obj));
      this.todoItems.push(obj);
    },

    removeOneItem(todoItem, index) {
      localStorage.removeItem(todoItem.item);
      this.todoItems.splice(index, 1);
    },

    clearAllItems() {
      localStorage.clear();
      this.todoItems = [];
    },
    toggleOneItem(todoItem, index) {
      // todoItem.completed = !todoItem.completed;
      this.todoItems[index].completed = !this.todoItems[index].completed;
      localStorage.removeItem(todoItem.item);
      localStorage.setItem(todoItem.item, JSON.stringify(todoItem));
    },
  },

  created() {
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        this.todoItems.push(
          JSON.parse(localStorage.getItem(localStorage.key(i)))
        );
      }
    }
  },

  components: {
    TodoHeader,
    TodoInput,
    TodoList,
    TodoFooter,
  },
};
</script>

<style>
body {
  text-align: center;
  background-color: rgb(241, 241, 241);
}

input {
  border-style: groove;
  width: 200px;
}

button {
  border-style: none;
}

.shadow {
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.03);
}
</style>