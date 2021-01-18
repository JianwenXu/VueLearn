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
    render() {
      const colProp = this.colComponentOptions.propsData.prop;
      if (colProp) {
        return (
          <span class="cell">{this.data[colProp]}</span>
        );
      }

      const scopedSlots = this.colComponentInstance.$scopedSlots
      return (
        <span class="cell">
          {[
            scopedSlots.default({
              scope: this.data
            })
          ]}
        </span>
      )
    }
  }
</script>

<style scoped>
  .cell {
    display: inline-block;
    padding: 10px 20px;
  }
</style>