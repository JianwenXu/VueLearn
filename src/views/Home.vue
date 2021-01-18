<template>
  <div class="home">
    <h2>自定义 table 组件</h2>
    <KTable
      :data="tableData"
      style="width: 100%"
    >
      <KTableColumn
        prop="date"
        label="日期"
        width="180">
      </KTableColumn>
      <KTableColumn
        prop="name"
        label="姓名"
        width="180">
      </KTableColumn>
      <KTableColumn
        prop="address"
        label="地址">
      </KTableColumn>
      <KTableColumn
        label="操作"
        width="100">
        <!-- <template> -->
        <template v-slot:default="slotProps">
          <a @click="handleView(slotProps)">查看</a>
          <a @click="handleEdit(slotProps)">编辑</a>
        </template>
      </KTableColumn>
    </KTable>
  </div>
</template>

<script>
// @ is an alias to /src
import KTable from '@/components/table/index.vue';
import KTableColumn from '@/components/table/column.vue';

export default {
  name: 'Home',
  components: {
    KTable,
    KTableColumn
  },
  data() {
    return {
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
    }
  },
  methods: {
    handleView(scope) {
      console.log('查看', scope);
    },
    handleEdit(scope) {
      console.log('编辑', scope);
    }
  },
}
</script>
