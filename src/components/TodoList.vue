<template>
  <div>
    <ul>
      <li
        v-for="(todoItem, index) in todoItems"
        v-bind:key="todoItem.item"
        class="shadow"
      >
        <button
          v-bind:class="{ checkBtnCompleted: todoItem.completed }"
          v-on:click="toggleComplete(todoItem, index)"
        >
          ✅
        </button>
        <span v-bind:class="{ textCompleted: todoItem.completed }">{{
          todoItem.item
        }}</span>
        <button v-on:click="removeTodo(todoItem, index)" v-on:add="getTodoList">
          🗑
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      todoItems: [],
    };
  },

  created() {
    this.getTodoList();
  },

  methods: {
    getTodoList() {
      if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          this.todoItems.push(
            JSON.parse(localStorage.getItem(localStorage.key(i)))
          );
        }
      }
    },

    toggleComplete(todoItem, index) {
      todoItem.completed = !todoItem.completed;
      localStorage.removeItem(todoItem.item);
      localStorage.setItem(todoItem.item, JSON.stringify(todoItem));
      console.log(index);
    },

    removeTodo(todoItem, index) {
      localStorage.removeItem(localStorage.key(index));
      this.todoItems.splice(index, 1);
    },
  },
};
</script>

<style>
button {
  border: none;
}

.checkBtnCompleted {
  color: gray;
}

.textCompleted {
  text-decoration: line-through;
  color: gray;
}
</style>