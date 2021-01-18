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
    render() {
      return (
        <span class="thead">
          {this.label}
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