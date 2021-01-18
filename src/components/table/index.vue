<template>
  <div>
    <div>
      <slot></slot>
    </div>
    <div>
      <div v-for="(d, idx) in tableData" :key="d.id || idx">
        <span v-for="(col, cIdx) in $slots.default" :key="col.id || cIdx">
          <KCell :data="d" :column="col" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import KCell from './cell.vue';
  import { DEC } from './column.vue'
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
      defaultSort: {
        type: Object
      }
    },
    data() {
      return {
        // 存储当前排序的值
        sort: {},
        tableData: []
      }
    },
    mounted() {
      const defaultSort = this.defaultSort;
      if (defaultSort && typeof defaultSort === 'object') {
        this.sort = {
          ...defaultSort
        };
      }
      // TODO 这里应该是一个深拷贝
      this.tableData = this.data;
    },
    watch: {
      sort(newValue, oldValue) {
        // 过滤第一次变化
        if (newValue.prop && oldValue.prop) {
          this.tableData.sort((i1, i2) => {
            const sortProp = newValue.prop;
            // TODO 根据不同的类型进行判断
            if (newValue.order === DEC) {
              return i2[sortProp].localeCompare(i1[sortProp])
            }
            return i1[sortProp].localeCompare(i2[sortProp])
          })
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>