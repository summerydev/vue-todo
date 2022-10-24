<template>
  <footer>
    <button v-on:click="removeAll">전체 삭제</button>
  </footer>
</template>

<script>
export default {
  methods: {
    removeAll() {
      if (confirm("전체 삭제 하시겠습니까?")) {
        localStorage.clear();
      }
    },
  },
};
</script>

<style>
</style>