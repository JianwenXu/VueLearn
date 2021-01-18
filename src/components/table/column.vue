<script>
  export default {
    props: {
      prop: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      }
    },
    render(h) {
      return h('span', this.label);
    }
  }
</script>

<style lang="scss" scoped>

</style>