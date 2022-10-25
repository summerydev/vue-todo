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
- [UX개선](#UX개선)
  - [개선 요구 사항](#개선-요구-사항)
  - [Modal.vue 생성](#modalvue-생성)
  - [컴포넌트 주입(1)](#컴포넌트-주입1)
  - [컴포넌트 주입(2)](#컴포넌트-주입2)
  - [`v-if` 사용해 modal 로직 처리](#v-if-사용해-modal-로직-처리)

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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
# 리팩토링

## 문제점

- 할 일 등록 시 리스트가 업데이트 되지 않음
- 할 일 전체 삭제 시 리스트가 업데이트 되지 않음
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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
&nbsp; 
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

---
&nbsp; 
# 개선 요구 사항

- input에 입력값 없을 때 버튼 클릭 시 alert
  - modal 컴포넌트 생성
- 전체 삭제 시 modal 컴포넌트 재활용

&nbsp; 
# Modal.vue 생성

[https://v2.vuejs.org/v2/examples/modal.html](https://v2.vuejs.org/v2/examples/modal.html)

[https://codesandbox.io/s/github/vuejs/v2.vuejs.org/tree/master/src/v2/examples/vue-20-modal-component?from-embed=&file=/index.html:285-1096](https://codesandbox.io/s/github/vuejs/v2.vuejs.org/tree/master/src/v2/examples/vue-20-modal-component?from-embed=&file=/index.html:285-1096)

- [vue공식사이트](https://v2.vuejs.org/v2/examples/modal.html)의 modal 컴포넌트 예시를 가져와 common폴더에 Modal 컴포넌트 파일을 생성한다.

`/common/Modal.vue`

```
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"> default header </slot>
          </div>

          <div class="modal-body">
            <slot name="body"> default body </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
```

```jsx
<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
```

&nbsp; 
# 컴포넌트 주입(1)

input 입력값이 없을 때 modal창이 띄워져야 하기 때문에 TodoIput.vue 파일에 컴포넌트를 주입한다.

- 스크립트에 import
- component에 정의
- data에 showModal값 생성
- template에 생성

`TodoInput.vue`

```jsx
<template>
  <div>
    <input type="text" v-model="newTodoItem" v-on:keyup.enter="addTodo" />
    <button v-on:click="addTodo">+</button>
    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">🧐 <button @click="showModal = false">❌</button></h3>
      <div slot="body">아무것도 입력하지 않으셨네요!</div>
    </Modal>
  </div>
</template>
```

```jsx
import Modal from "./common/Modal.vue";

export default {
  data: () => {
    return {
      newTodoItem: "",
      showModal: false,
    };
  },

  methods: {
    addTodo() {
      if (this.newTodoItem !== "") {
        this.$emit("addTodoItem", this.newTodoItem);
        this.clearInput();
      } else {
        this.showModal = !this.showModal;
      }
    },
    clearInput() {
      this.newTodoItem = "";
    },
  },

  components: { Modal: Modal },
};
```

&nbsp; 
# 컴포넌트 주입(2)

전체 삭제 버튼 클릭 시 브라우저 confirm창이 아닌 modal 창으로 변경하기 위해 TodoFooter에 Modal컴포넌트를 주입한다.

- 스크립트에 import
- data속성에 showModal 정의
- methods 수정
- Modal태그 안에 취소버튼, 삭제하기 버튼 생성

`TodoFooter.vue`

```jsx
<template>
  <footer>
    <button @click="showModal = true">전체 삭제</button>
    <Modal v-if="showModal" @close="showModal = false">
      <h1 slot="header">⚠️</h1>
      <div slot="body">
        모두 삭제하시겠습니까?
        <div>
          <button @click="showModal = false">취소</button>
          <button v-on:click="clearAll" @click="showModal = false">
            삭제하기
          </button>
        </div>
      </div>
    </Modal>
  </footer>
</template>
```

```jsx
import Modal from "./common/Modal.vue";

export default {
  data: () => {
    return {
      showModal: false,
    };
  },
  methods: {
    clearAll() {
      this.$emit("clear");
    },
  },
  components: {
    Modal: Modal,
  },
};
```

Modal 컴포넌트 태그 안에 취소 버튼은 클릭 시 모달이 닫기도록, 삭제하기 버튼은 모달이 닫김과 동시에 클릭이벤트로 clearAll 메소드가 실행되도록 작성했다.

clearAll 메소드는 상위 컴포넌트로 clear emit을 발생시키고, App.vue에서 로직을 처리한다.


---  
&nbsp;
# `v-if` 사용해 modal 로직 처리

기존 코드로는 삭제할 항목이 없음에도 `모두 삭제하시겠습니까?` 모달이 보여진다.

`v-if`, `v-else-if`를 사용해 삭제 항목 없을 시 다른 모달을 보여주도록 변경한다.

`App.vue`

- App.vue에서 TodoFooter로 props 전달

```jsx
<TodoFooter
  v-bind:propsdata="todoItems"
  v-on:clear="clearAllItems"
></TodoFooter>
```

`TodoFooter.vue`

- TodoFooter에서 propsdata 정의

```jsx
props: ["propsdata"],

data: () => {
    return {
      showModal: false,
    };
  },
```

- 삭제할 항목이 있는 경우

```jsx
<Modal v-if="showModal && propsdata.length != 0" @close="showModal = false">
      <h1 slot="header">⚠️</h1>
      <div slot="body">
        모두 삭제하시겠습니까?
        <div>
          <button @click="showModal = false">취소</button>
          <button v-on:click="clearAll" @click="showModal = false">
            삭제하기
          </button>
        </div>
      </div>
    </Modal>
```

- 삭제할 항목이 없는 경우

```jsx
<Modal
      v-else-if="showModal && propsdata.length == 0"
      @close="showModal = false"
    >
      <h1 slot="header">🤓</h1>
      <div slot="body">
        삭제할 항목이 없습니다.
        <button @click="showModal = false">닫기</button>
      </div>
    </Modal>
```