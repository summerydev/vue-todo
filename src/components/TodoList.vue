<template>
  <div>
    <transition-group name="list" tag="ul">
      <li
        v-for="(todoItem, index) in this.storedTodoItems"
        v-bind:key="todoItem.item"
        class="shadow"
      >
        <button
          v-bind:class="{ checkBtnCompleted: todoItem.completed }"
          v-on:click="toggleComplete({ todoItem, index })"
        >
          β
        </button>
        <span v-bind:class="{ textCompleted: todoItem.completed }">{{
          todoItem.item
        }}</span>
        <div>
          <button v-on:click="removeTodo({ todoItem, index })">π</button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations({
      removeTodo: "removeOneItem",
      toggleComplete: "completeOneItem",
    }),
  },
  computed: {
    ...mapGetters(["storedTodoItems"]),
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

/** λ¦¬μ€νΈ μμ΄ν νΈλμ§μ ν¨κ³Ό */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>