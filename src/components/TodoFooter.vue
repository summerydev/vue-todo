<template>
  <footer>
    <button
      @click="
        showModal = true;
      "
    >
      전체 삭제
    </button>
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
  </footer>
</template>

<script>
import Modal from "./common/Modal.vue";

export default {
  props: ["propsdata"],

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
    Modal,
  },
};
</script>

<style>
</style>