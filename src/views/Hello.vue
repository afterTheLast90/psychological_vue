<template>
  <div id="hello">
    <el-image style="display: block;"
                            :src="getUrl('/upload/hello.png')"></el-image>
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
#hello{
  background-color: #2c3e50;
  height: calc(100% + 20px);
  width: calc(100% + 40px);
  padding: 0px;
  margin-top: -20px;
  margin-left: -20px;
  overflow: hidden;
}
</style>
