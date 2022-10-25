<template>
  <footer>
    <button v-on:click="clearAll">전체 삭제</button>
  </footer>
</template>

<script>
export default {
  methods: {
    clearAll() {
      if (confirm("전체 삭제 하시겠습니까?")) {
        this.$emit("clear");
      }
    },
  },
};
</script>

<style>
</style>