<template>
  <div>
    <transition-group name="list" tag="ul">
      <li
        v-for="(todoItem, index) in this.$store.state.todoItems"
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
        <div>
          <button v-on:click="removeTodo(todoItem, index)">🗑</button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  methods: {
    toggleComplete(todoItem, index) {
      this.$store.commit("completeOneItem", { todoItem, index });
    },

    removeTodo(todoItem, index) {
      this.$store.commit("removeOneItem", { todoItem, index });
    },
  },
};
</script>

<style>
ul {
  list-style: none;
  text-align: start;
}

li > div {
  display: flex;
  flex-direction: row-reverse;
}

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

/** 리스트 아이템 트랜지션 효과 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>