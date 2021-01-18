<template>
  <span>{{ label }}</span>
</template>

<script>
  export default {
    props: {
      prop: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>