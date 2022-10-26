<template>
  <header>
    <h1>
      <a href="">{{ this.$store.state.headerText }}</a>
    </h1>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
h1 {
  color: rgb(67, 67, 67);
  font-weight: 900;
  margin: 2.5rem 0 1.5rem;
}
a{
  text-decoration: none;
}
</style>