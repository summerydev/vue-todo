<template>
  <div>
    <ul>
      <li
        v-for="(todoItem, index) in propsdata"
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
        <button v-on:click="removeTodo(todoItem, index)">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["propsdata"],
  methods: {
    toggleComplete(todoItem, index) {
      this.$emit("toggleItem", todoItem, index);
    },

    removeTodo(todoItem, index) {
      this.$emit("removeTodoItem", todoItem, index);
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