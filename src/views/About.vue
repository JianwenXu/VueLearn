<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="globalTest();test();test2();">测试</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      counter: 1
    }
  },
  methods: {
    test() {
      console.log('局部 test', this);
    },
    test2() {
      console.log('test2');
    }
  },
}
</script>
