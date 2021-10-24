<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header style="padding: 0px;background-color: #545c64">
<!--        <el-menu-->
<!--            style="height: 60px;"-->
<!--            mode="horizontal"-->
<!--            background-color="#545c64"-->
<!--            text-color="#fff"-->
<!--            active-text-color="#ffd04b">-->
<!--        <el-row style="height: 60px">-->
<!--          <el-col :span="3" style="height: 60px">-->
<!--          </el-col>-->
<!--        </el-row>-->
          <h2 style="color: #DCDFE6;margin-top: 14px;margin-left: -1700px" >心理素质测评后台</h2>
<!--        </el-menu>-->
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
              <template #title>问卷管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/publish" v-if="role==0 || role==1">
              <template #title>发布记录</template>
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true" v-if="role==4 || role==1">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true" v-if="role==4">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true" v-if="role==4">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true" v-if="role==4">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true" v-if="role==4">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
            </el-menu-item>
            <el-menu-item class="noHover" :disabled="true">
              <template>
                <el-image style="display: block;z-index: 999"
                          :src="getUrl('/upload/logo.png')"></el-image>
              </template>
            </el-menu-item>
          </el-menu>

        </el-aside>
        <el-container>
<!--          <el-main v-if="window.location.href.indexOf('hello')!=-1" style="background-color: #2c3e50">-->
<!--            <router-view></router-view>-->
<!--          </el-main>-->
<!--          <el-main v-if="!window.location.href.indexOf('hello')!=-1" style="box-sizing: content-box;">-->
<!--          <router-view></router-view>-->
<!--        </el-main>-->
          <el-main>
            <router-view></router-view>
          </el-main>
          <!--          <el-footer>Footer</el-footer>-->
        </el-container>
      </el-container>
    </el-container>


  </div>
</template>

<script>

import request from "../utils/request";

export default {
  data() {
    return {
      role: -1,
      flag:false
    }
  }, methods: {
    getUrl(url) {
      return request.baseUrl + url;
    },
  },
  mounted() {
    // if (window.location.href.indexOf("hello")!=-1){
    //   this.flag=true
    // }
    this.role = localStorage.getItem("userRole")
  }
}
</script>
<style>
.el-main{
  padding: 20px 20px 0px 20px;
}
.noHover{
  opacity:1 !important;
  cursor:default !important;
  /*background-color: rgb(84,92,100);*/
}
</style>
