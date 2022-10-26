# [TodoApp 전체 개요 README](https://github.com/summerydev/vue-todo/tree/main)

# Vuex

# 목차

- [Vuex란](#vuex란)
- [세팅하기](#세팅하기)
  - [설치](#설치)
  - [store생성](#store-생성)
  - [등록](#등록)
- [state 사용하기](#state-사용하기)
  - [Header 텍스트 state로 변경](#header-텍스트-state로-변경)
  - [todoItems state로 변경](#todoitems-state로-변경)
- [mutations 사용하기](#mutations-사용하기)
  - [todo 추가 기능 리팩토링](#todo-추가-기능-리팩토링)
  - [todo 삭제 기능 리팩토링](#todo-삭제-기능-리팩토링)
  - [todo 완료 기능 리팩토링](#todo-완료-기능-리팩토링)
  - [todo 전체 삭제 기능 리팩토링](#todo-전체-삭제-기능-리팩토링)

---

# Vuex란

- 상태 관리 라이브러리
- 컴포넌트들을 효율적으로 관리할 수 있음
- state, getters, mutations, actions 속성 중심
  - state : 컴포넌트 공유 데이터 `data`
  - getters : 연산된 state값 접근 `computed`
  - mutations : state값 변경하는 이벤트로직, 메서드 `methods`, commit()으로 동작
  - actions : 비동기 처리 로직 메서드 `aysnc methods`
- 컴포넌트 → 비동기로직 → 동기로직 → 상태

[Vuex 시작하기 1 - Vuex와 State](https://joshua1988.github.io/web-development/vuejs/vuex-start/)

---

# 세팅하기

## 설치

vuex는 라이브러리 설치 시 버전을 명시해야 한다.

```bash
npm i vuex@3.6.2 --save
```

## store 생성

`/src/store/store.js`

```jsx
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({});
```

## 등록

`main.js`

```jsx
import Vue from "vue";
import App from "./App.vue";
import { store } from "./store/store"; // import

Vue.config.productionTip = false;

new Vue({
  store, // 등록
  render: (h) => h(App),
}).$mount("#app");
```

# state 사용하기

## Header 텍스트 state로 변경

- TodoHeader text를 store를 사용해 받아온다.
- store.state에 headerText를 선언한다.

`store.js`

```jsx
export const store = new Vuex.Store({
  state: {
    headerText: "My Todos",
  },
});
```

- TodoHeader에서 state의 값에 접근한다.

`TodoHeader`

```jsx
<template>
  <header><h1>{{this.$store.state.headerText}}</h1></header>
</template>
```

- 변경된 데이터는 개발자도구 - vue - vuex에서 확인가능하다.

## todoItems state로 변경

- store.js의 store에 todoItems를 선언한다.

```jsx
export const store = new Vuex.Store({
  state: {
    headerText: "My Todos",
    todoItems: [],
  },
});
```

- store.js에서 storage를 생성해, 로컬스토리지에 접근해 fetch하는 함수를 만든다.

```jsx
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
```

- store.js의 store에 todoItems 값을 변경한다.

```jsx
todoItems: storage.fetch();
```

- TodoList.vue 에서 props 데이터를 받아오는 대신 store의 데이터를 가져온다. `this.$store.state` 로 접근

```jsx
<template>
  <div>
    <transition-group name="list" tag="ul">
      <li
        v-for="(todoItem, index) in this.$store.state.todoItems"
        v-bind:key="todoItem.item"
        class="shadow"
      >
// ...
```

---

# mutations 사용하기

mutations은 접근 시 commit을 이용해 mutations 이벤트를 호출해야 한다.

```jsx
this.$store.commit("mutations 이벤트 이름", 인자);
```

## todo 추가 기능 리팩토링

- TodoInput에서 props와 emit으로 데이터를 주고받는 대신, mutations의 이벤트를 호출하고 추가할 값을 넘기도록 변경한다.

`TodoInput.vue`

```jsx
<button v-on:click="addTodo">➕</button>
```

```jsx
addTodo() {
      if (this.newTodoItem !== "") {
        this.$store.commit("addOneItem", this.newTodoItem);
        this.clearInput();
      } else {
        this.showModal = !this.showModal;
      }
    },
```

`store.js`

```jsx
mutations: {
    addOneItem(state, todoItem) {
      const obj = { completed: false, item: todoItem };
      localStorage.setItem(todoItem, JSON.stringify(obj));
      state.todoItems.push(obj);
    },
}
```

`TodoInput.vue` 에서 버튼 클릭 시 addTodo 메소드로 연결

→ addTodo 메소드에서 store로 addOneItem 이벤트 호출 및 input 값 넘김

→ `store.js` mutations의 addOneItem에서 로직 수행

## todo 삭제 기능 리팩토링

- 버튼 클릭 시 removeTodo 메소드 실행
- removeTodo 메소드에서 store의 removeOneItem 이벤트 호출

`TodoList.vue`

```jsx
<div>
  <button v-on:click="removeTodo(todoItem, index)">🗑</button>
</div>
```

```jsx
export default {
  methods: {
    removeTodo(todoItem, index) {
      this.$store.commit("removeOneItem", todoItem, index);
    },
  },
};
```

- removeOneItem이벤트에서 로직 수행
  - localStorage 데이터 삭제
  - state의 배열 데이터 변경

`store.js`

```jsx
mutations: {
	removeOneItem(state, todoItem) {
	      localStorage.removeItem(todoItem.item);
	      state.todoItems.splice(todoItem, 1);
	    },
}
```

## todo 완료 기능 리팩토링

- 버튼 클릭 시 toggleComplete 메소드 실행
- toggleComplete 메소드에서 mutations completeOneItem 이벤트 호출

`TodoList.vue`

```jsx
<button
  v-bind:class="{ checkBtnCompleted: todoItem.completed }"
  v-on:click="toggleComplete(todoItem, index)"
>
  ✅
</button>
```

```jsx
toggleComplete(todoItem, index) {
      this.$store.commit("completeOneItem", todoItem, index);
    },
```

- completeOneItem 이벤트에서 로직 처리
  - localStorage에서 해당 todo 삭제(localStorage는 수정 불가능)
  - 완료 상태를 변경
  - localStorage.setItem

`store.js`

```jsx
mutations: {
completeOneItem(state, todoItem) {
      localStorage.removeItem(todoItem.item);
      todoItem.completed = !todoItem.completed;
      localStorage.setItem(todoItem.item, JSON.stringify(todoItem));
    },
}
```

## todo 전체 삭제 기능 리팩토링

- 버튼 클릭 시 clearAll 메소드 실행
- clearAll 메소드에서 store의 clearAllItems 이벤트 호출

`TodoFooter.vue`

```jsx
<button v-on:click="clearAll" @click="showModal = false">
	삭제하기
</button>
```

```jsx
methods: {
    clearAll(state) {
      this.$store.commit("clearAllItems", state);
    },
  },
```

- clearAllItems 이벤트에서 로직 수행
  - localStorage 전체 삭제
  - state를 빈 배열로 변경

```jsx
mutations: {
	clearAllItems(state) {
	      localStorage.clear();
	      state.todoItems = [];
	    },
}
```
