<template>
  <div>
    <button @click="test()">test</button>
    <div>
      <slot></slot>
    </div>
    <div>
      <div v-for="(d, idx) in data" :key="d.id || idx">
        <span v-for="(col, cIdx) in $slots.default" :key="col.id || cIdx">
          <KCell :data="d" :column="col" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import KCell from './cell.vue';
  // todo style, class 怎么传参
  export default {
    components: {
      KCell,
    },
    props: {
      data: {
        type: Array,
        required: true
      },
    },
    methods: {
      test() {
        console.log(this.$slots.default);
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>