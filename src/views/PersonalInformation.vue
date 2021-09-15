<template>
  <div>
    <el-container>
      <el-header height="30">
        <el-avatar :size="100" :src="circleUrl"></el-avatar>
      </el-header>
      <el-main>
        <el-form label-position="left">
          <el-form-item label="姓名" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.userName }}
            </span>
          </el-form-item>
          <el-form-item label="账号" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.userAccount }}
            </span>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.userPhoneNumber }}
            </span>
          </el-form-item>
          <el-form-item label="出生日期" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.userBirthday }}
            </span>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  data() {
    return {
      userId: 200861932433477,
      user: [],
      formLabelWidth: "80px",
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  mounted() {
    this.queryUser();
  },
  methods: {
    queryUser() {
      request.get("/getUser", {
        userId: this.userId
      }).then(res => {
        this.user = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
