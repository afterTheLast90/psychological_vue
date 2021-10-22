<template>
  <div>
    <el-image style="display: block;width: 50%;margin: 7% 25% 5% 25%"
              :src="getUrl('/upload/hello.jpg')"></el-image>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "Hello",
  methods:{
    getUrl(url){
      return request.baseUrl+url;
    },
  }
}
</script>

<style scoped>

</style>
