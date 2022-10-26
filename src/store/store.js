import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const storage = {
  fetch() {
    const arr = [];
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        arr.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }
    return arr;
  },
};

export const store = new Vuex.Store({
  state: {
    headerText: "My Todos",
    todoItems: storage.fetch(),
  },

  mutations: {
    addOneItem(state, todoItem) {
      const obj = { completed: false, item: todoItem };
      localStorage.setItem(todoItem, JSON.stringify(obj));
      state.todoItems.push(obj);
    },

    removeOneItem(state, todoItem) {
      localStorage.removeItem(todoItem.item);
      state.todoItems.splice(todoItem, 1);
    },

    completeOneItem(state, todoItem) {
      localStorage.removeItem(todoItem.item);
      todoItem.completed = !todoItem.completed;
      localStorage.setItem(todoItem.item, JSON.stringify(todoItem));
    },

    clearAllItems(state) {
      localStorage.clear();
      state.todoItems = [];
    },
  },
});
