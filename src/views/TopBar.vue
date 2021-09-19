<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-header style="padding: 0px">
        <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

          <el-menu-item index="3">消息中心</el-menu-item>
        </el-menu>
      </el-header>
      <el-container style="height: 100%;overflow-y: hidden">
        <el-aside width="200px">
          <el-menu
              style="height: 100%"
              :uniqueOpened="true"
              default-active="/topBar/administrator"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b" :router="true">
            <el-menu-item index="/topBar/administrator">
              <template #title>管理员管理</template>
            </el-menu-item>

            <el-menu-item index="/topBar/area">
              <template #title>地区管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/teacher">

              <template #title>教师管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/classes">
              <template #title>班级管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/student">
              <template #title>学生管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/questionnaire">
              <template #title>问卷管理</template>
            </el-menu-item>
            <el-menu-item index="/topBar/publish">
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
</script>

<style>

</style>
