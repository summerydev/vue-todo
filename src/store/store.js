import Vue from "vue";
import Vuex from "vuex";
import * as mutations from "./mutations";

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

  getters: {
    storedTodoItems(state) {
      return state.todoItems;
    },
  },

  mutations,
});
