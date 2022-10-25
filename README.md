# Vue.js TodoApp

날짜: 2022년 10월 24일
태그: vue

[Vue.js 중급 강좌 - 웹앱 제작으로 배워보는 Vue.js, ES6, Vuex - 인프런 | 강의](https://www.inflearn.com/course/vue-pwa-vue-js-%EC%A4%91%EA%B8%89/dashboard)

# 목차

- [개요](#개요)
  - [개발환경](#개발환경)
  - [컴포넌트 구성](#컴포넌트-구성)
- [구현](#구현)
  - [프로젝트 생성](#프로젝트-생성)
  - [컴포넌트 생성 및 등록](#컴포넌트-생성-및-등록)
  - [TodoHeader 컴포넌트 구현](#todoheader-컴포넌트-구현)
  - [TodoInput 컴포넌트 구현](#todoinput-컴포넌트-구현)
  - [TodoList 컴포넌트 구현](#todolist-컴포넌트-구현)
    - [todoList 화면 구현](#todolist-화면-구현)
    - [todoList 삭제 구현](#todolist-삭제-구현)
  - [완료 기능 추가](#완료-기능-추가)
    - [TodoInput 수정](#todoinput-수정)
    - [TodoList 수정](#todolist-수정)
  - [TodoFooter 컴포넌트 구현](#todofooter-컴포넌트-구현)
    - [전체 삭제 버튼 구현](#전체-삭제-버튼-구현)
- [리팩토링](#리팩토링)
  - [App.vue로 데이터 흐름 변경](#appvue로-데이터-흐름-변경)
  - [todo 추가 시 리스트 업데이트](#todo-추가-시-리스트-업데이트)
  - [todo 삭제 시 리스트 업데이트](#todo-삭제-시-리스트-업데이트)
  - [todo 완료 기능 수정](#todo-완료-기능-수정)
  - [todo 전체 삭제 시 리스트 업데이트](#todo-전체-삭제-시-리스트-업데이트)

---

# 개요

## 개발환경

- [Chrome](https://www.google.com/intl/ko/chrome/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)
- [Vue.js Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Git](https://git-scm.com/downloads)
- [Github](https://github.com/)

## 컴포넌트 구성

- TodoHeader
  - app 헤더 컴포넌트
  - `src/components/TodoHeader.vue`
- TodoInput
  - todo 입력 컴포넌트
  - `src/components/TodoInput.vue`
- TodoList
  - 입력한 todo 리스트 컴포넌트
  - `src/components/TodoList.vue`
- TodoFooter
  - app footer 컴포넌트
  - `src/components/TodoFooter.vue`

---

# 구현

## 프로젝트 생성

```bash
vue create vue-todo

# 또는
vue init webpack-simple vue-todo
```

## 컴포넌트 생성 및 등록

header, input, list, footer 컴포넌트를 생성하고 App.vue에 주입해 컴포넌트를 등록한다.

```jsx
<template>
  <div id="app">
    <TodoHeader></TodoHeader>
    <TodoInput></TodoInput>
    <TodoList></TodoList>
    <TodoFooter></TodoFooter>
  </div>
</template>
```

```jsx
import TodoHeader from "./components/TodoHeader.vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import TodoFooter from "./components/TodoFooter.vue";

export default {
  components: {
    TodoHeader: TodoHeader,
    TodoInput: TodoInput,
    TodoList: TodoList,
    TodoFooter: TodoFooter,
  }
```

## TodoHeader 컴포넌트 구현

- style의 scoped 속성 : 현재 컴포넌트에만 적용됨을 의미

```jsx
<template>
  <header><h1>my TODOs</h1></header>
</template>

<style scoped>
h1 {
  color: rgb(67, 67, 67);
  font-weight: 900;
  margin: 2.5rem 0 1.5rem;
}
</style>
```

## TodoInput 컴포넌트 구현

- input태그에 들어오는 데이터를 v-model을 사용해 newTodoItem로 설정
- button을 클릭할 때 로컬스토리지에 input내용이 저장되도록 v-on:click="addTodo" 설정

```jsx
<template>
  <div>
    <input type="text" v-model="newTodoItem" v-on:keyup.enter="addTodo" />
    <button v-on:click="addTodo">+</button>
  </div>
</template>
```

```jsx
export default {
  data: () => {
    return {
      newTodoItem: "",
    };
  },
  methods: {
    addTodo() {
      console.log(this.newTodoItem);
      localStorage.setItem(this.newTodoItem, this.newTodoItem);
      this.clearInput();
    },
    clearInput() {
      this.newTodoItem = "";
    },
  },
};
```

## TodoList 컴포넌트 구현

### todoList 화면 구현

- `created` 훅을 사용해 인스턴스 생성 직후 로컬스토리지에 있는 데이터를 data 속성의 `todoItems`으로 push

<aside>
❗ **created**
vue에서 인스턴스가 생성되자마자 호출되는 라이프사이클 훅
리액트로 봤을 때 useEffect?

</aside>

- `v-for` 속성을 사용해 `li`태그에 데이터 뿌림
- `v-bind:key`로 매핑

```jsx
<template>
  <div>
    <ul>
      <li v-for="todoItem in todoItems" v-bind:key="todoItem">
        {{ todoItem }}
      </li>
    </ul>
  </div>
</template>
```

```jsx
export default {
  data: () => {
    return {
      todoItems: [],
    };
  },

  created() {
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        this.todoItems.push(localStorage.key(i));
      }
    }
  },
};
```

### todoList 삭제 구현

- 삭제 버튼 클릭 시 `v-on:click` 사용해 삭제 메소드 실행
- `removeTodo` : splice를 사용해 삭제하는 todo의 인덱스 기준 1 삭제

```jsx
<template>
  <div>
    <ul>
      <li v-for="(todoItem, index) in todoItems" v-bind:key="todoItem">
        <button v-on:click="removeTodo(todoItem, index)">🗑</button>
      </li>
    </ul>
  </div>
</template>
```

```jsx
export default {
  data: () => {
    return {
      todoItems: [],
    };
  },

  created() {
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        this.todoItems.push(localStorage.key(i));
      }
    }
  },

  methods: {
    toggleComplete() {},

    removeTodo(todoItem, index) {
      localStorage.removeItem(localStorage.key(index));
      this.todoItems.splice(index, 1);
    },
  },
};
</script>
```

## 완료 기능 추가

### TodoInput 수정

- input에 값이 있을 때만 add하도록 수정
- add 시 completed 속성 전달

```jsx
addTodo() {
      if (this.newTodoItem !== "") {
        var obj = { completed: false, item: this.newTodoItem };
        console.log(this.newTodoItem);
        localStorage.setItem(this.newTodoItem, JSON.stringify(obj));
        this.clearInput();
      }
    },
```

### TodoList 수정

- 체크 버튼 클릭 시 text 색 변경 및 삭제 라인 변경되도록 css class 바뀌는 `v-bind:class` 설정
- 체크 버튼 클릭 시 로컬스토리지의 아이템 삭제, completed: true 값 set

```jsx
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
```

```jsx
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
```

## TodoFooter 컴포넌트 구현

### 전체 삭제 버튼 구현

- 작성해본 코드

```jsx
<template>
  <footer>
    <button v-on:click="clearAll">전체 삭제</button>
  </footer>
</template>
```

```jsx
export default {
  methods: {
    clearAll() {
      if (confirm("전체 삭제 하시겠습니까?")) {
        localStorage.clear();
      }
    },
  },
};
```

confirm를 사용해서 확인을 누르면 로컬스토리지의 데이터가 전부 삭제되도록, 취소를 누르면 실행되는 코드가 없도록 작성했다.

---

# 리팩토링

## 문제점

- 할 일 등록 시 리스트가 업데이트 되지 않음
- 할 일 전체 삭제 시 리스트가 업데이트 되지 않음

## App.vue로 데이터 흐름 변경

- TodoList data를 App.vue로 넣고, 값을 TodoList propsdata로 보내는 방식으로 변경
- App.vue

```jsx
<template>
  <div id="app">
    <TodoHeader></TodoHeader>
    <TodoInput></TodoInput>
    <TodoList v-bind:propsdata="todoItems"></TodoList>
    <TodoFooter></TodoFooter>
  </div>
</template>
```

```jsx
export default {
  data: () => {
    return {
      todoItems: [],
    };
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
```

- TodoList.vue

```jsx
<li
  v-for="(todoItem, index) in propsdata"
  v-bind:key="todoItem.item"
  class="shadow"
>
```

```jsx
export default {
  props: ["propsdata"],
// ...
```

---

## todo 추가 시 리스트 업데이트

- TodoInput에서 버튼을 클릭해 아이템을 추가할 때마다 이벤트를 발생시켜 App.vue로 emit보내기
- App.vue에서는 emit 발생 마다 todoItems 배열에 newTodoItem push
- TodoInput.vue

```jsx
methods: {
    addTodo() {
      if (this.newTodoItem !== "") {
        this.$emit("addTodoItem", this.newTodoItem)
        this.clearInput();
      }
    },
```

- App.vue

```jsx
<TodoList v-bind:propsdata="todoItems"></TodoList>
```

```jsx
methods: {
    addOneItem(todoItem) {
      var obj = { completed: false, item: todoItem };
      localStorage.setItem(todoItem, JSON.stringify(obj));
      this.todoItems.push(obj);
    },
  },
```

---

## todo 삭제 시 리스트 업데이트

- TodoList에서 삭제 버튼을 클릭할 때마다 App.vue로 emit발생
- App.vue에서 emit을 받을 때마다 todoItems 배열에서 해당 아이템 삭제
- TodoList.vue

```jsx
removeTodo(todoItem, index) {
      this.$emit("removeTodoItem", todoItem, index);
    },
```

- App.vue

```jsx
<TodoList
  v-bind:propsdata="todoItems"
  v-on:removeTodoItem="removeOneItem"
></TodoList>
```

```jsx
removeOneItem(todoItem, index) {
      localStorage.removeItem(todoItem.item);
      this.todoItems.splice(index, 1);
    },
```

---

## todo 완료 기능 수정

- TodoList에서 emit발생 후 App.vue에서 동작하도록 수정
- TodoList.vue

```jsx
toggleComplete(todoItem, index) {
      this.$emit("toggleItem", todoItem, index);
    },
```

- App.vue

```jsx
<TodoList
  v-bind:propsdata="todoItems"
  v-on:removeTodoItem="removeOneItem"
  v-on:toggleItem="toggleOneItem"
></TodoList>
```

```jsx
toggleOneItem(todoItem, index) {
   // todoItem.completed = !todoItem.completed;
   this.todoItems[index].completed = !this.todoItems[index].completed;
   localStorage.removeItem(todoItem.item);
    ocalStorage.setItem(todoItem.item, JSON.stringify(todoItem));
    },
```

---

## todo 전체 삭제 시 리스트 업데이트

- todoFooter에서 전체 삭제 버튼 클릭, confirm에서 확인 클릭 시 emit발생
- App.vue에서 emit발생 시 clearAllItems 메서드 실행
- TodoInput.vue

```jsx
clearInput() {
      this.newTodoItem = "";
    },
```

- App.vue

```jsx
<TodoFooter v-on:clear="clearAllItems"></TodoFooter>
```

```jsx
clearAllItems() {
      console.log("a");
      localStorage.clear();
      this.todoItems = [];
    },
```
