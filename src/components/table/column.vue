<template>
  <th>{{ label }}</th>
</template>

<script>
  export default {
    props: {
      prop: {
        type: String,
        required: true
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