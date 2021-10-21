<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header style="padding: 0px;height: 60px">
        <el-menu
            style="height: 60px;"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

          <h1 style="color: #DCDFE6" >心理测评后台管理系统</h1>
        </el-menu>
      </el-header>
      <el-container style="height: 100%;overflow-y: hidden">
        <el-aside width="200px">
          <el-menu
              style="height: 100%;border-right-width: 0px "
              :uniqueOpened="true"
              default-active="/topBar/questionnaire"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b" router :default-active="this.$route.path">
            <el-menu-item index="/topBar/administrator" v-if="role==0">
              <template #title>管理员管理</template>
            </el-menu-item>

            <el-menu-item index="/topBar/area" v-if="role==0 || role==1">
              <template #title>地区管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/teacher" v-if="role==0 || role==1">
              <template #title>教师管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/classes" v-if="role==0 || role==1 || role ==4">
              <template #title>班级管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/student" v-if="role==0 || role==1 || role ==4">
              <template #title>学生管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/questionnaire" v-if="role==0 || role==1">
              <template #title >问卷管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/publish" v-if="role==0 || role==1">
              <template #title>发布记录</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        role : -1
      }
    },
    mounted() {
      this.role = localStorage.getItem("userRole")
    }
  }
</script>
<style>

</style>
