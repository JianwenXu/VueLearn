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
      },
      colComponentInstance() {
        return this.column.componentInstance;
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

      const scopedSlots = this.colComponentInstance.$scopedSlots
      return h('span', [
        scopedSlots.default({
          scope: this.data
        })
      ]);
    }
  }
</script>

<style lang="scss" scoped>

</style>