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
      colComponentOptions() {
        return this.column.componentOptions
      }
    },
    methods: {
      test() {
        console.log(this.column);
      }
    },
    render(h) {
      const colProp = this.colComponentOptions.propsData.prop;
      if (colProp) {
        return (
          h('span', this.data[colProp])
        );
      }
      const columnChildren = this.colComponentOptions.children;
      return h('span', null, columnChildren);
    }
  }
</script>

<style lang="scss" scoped>

</style>