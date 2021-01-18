<template>
  <span>
    <span v-if="colProp.prop">
      {{data[colProp.prop]}}
    </span>
    <span v-else>
      其他情况
    </span>
  </span>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        required: true
      },
      column: {
        type: Object,
        required: true
      }
    },
    computed: {
      colProp() {
        return this.column.componentOptions.propsData
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>