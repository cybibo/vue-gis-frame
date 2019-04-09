<template>
  <div class="main">
    hello! World
  </div>
</template>
<script>
import http from '@/api/http';
import apis from '@/api';

export default {
  components: {
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
    };
  },
  methods: {
    async getData() {
      let { data } = await http.post({ api: apis.getMapData });
      console.log(data)
    }
  }
};
</script>