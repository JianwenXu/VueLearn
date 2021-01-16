<template>
  <div>
    <button @click="test()">测试按钮</button>
    <table>
      <thead>
        <tr>
          <slot></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in data" :key="d.date">
          <td v-for="col in $slots.default" :key="col.componentOptions.propsData.prop">
            {{ d[col.componentOptions.propsData.prop] }}
          </td>
        </tr>
      </tbody>
      <tfoot></tfoot>
    </table>
  </div>
</template>

<script>
  // todo style, class 怎么传参
  export default {
    props: {
      data: {
        type: Array,
        required: true
      },
    },
    methods: {
      test() {
        console.log(this.$slots);
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>