<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header>心理测评</el-header>
      <el-main>
        <router-view></router-view></el-main>
      <el-footer style="padding: 0">
        <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true">
          <el-row>
            <el-col :span="7">
              <el-menu-item index="/mobile/personalInformation">个人信息</el-menu-item>
            </el-col>
            <el-col :span="10">
              <el-menu-item index="/mobile/beFilledWith">待填写问卷</el-menu-item>
            </el-col>
            <el-col :span="7">
              <el-menu-item index="/mobile/questionnaireResult">问卷结果</el-menu-item>
            </el-col>
          </el-row>
        </el-menu>
      </el-footer>
    </el-container>
  </div>

</template>

<script>
export default {
  name: "Mobile"
}
</script>

<style scoped>

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
