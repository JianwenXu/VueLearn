<script>
  export const DEC = 'descending';
  export const ASC = 'ascending';
  export default {
    props: {
      prop: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      sortable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      tableSort: {
        get: function () {
          return this.$parent.sort
        },
        set: function (v) {
          this.$parent.sort = v
        }
      }
    },
    methods: {
      sort() {
        const { order, prop } = this.tableSort;
        if (prop === this.prop) {
          this.tableSort = {
            prop: this.prop,
            order: order === DEC ? ASC : DEC
          };
        } else {
          this.tableSort = {
            prop: this.prop,
            order: DEC
          }
        }
      }
    },
    render() {
      const curSortable = this.prop === this.tableSort.prop
      const orderStr = this.tableSort.order === DEC ? '降序' : '升序'
      return (
        <span class="thead" onClick={this.sort}>
          {this.label}
          {this.sortable && curSortable && `(${orderStr})`}
          {this.sortable && !curSortable && '(可排序)'}
        </span>
      );
    }
  }
</script>

<style scoped>
  .thead {
    font-weight: bold;
    padding: 10px 20px;
  }
</style>