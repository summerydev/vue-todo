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

<script>
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
</script>

<style>
</style>