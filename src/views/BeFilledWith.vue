<template>
  <div class="be-filled-with">
    <el-collapse v-for="(item,index) in questionnaire" :key="index" accordion>
      <el-collapse-item :title="item.questionnaireName" style="text-align: left">
        <div  style="padding-left: 30px;">
          <div>创建人：{{item.creatorName}}</div>
          <div>问卷简介：{{item.questionnaireIntroduction}}</div>
          <div>时间：{{item.releaseTime+"~"+item.deadLine}}</div>
          <div>学生：{{item.studentName}}</div>
          <div>学生：{{item.studentId}}</div>
        </div>
        <div style="text-align: center;margin-top: 20px;">
          <router-link :to="{name:'answerQuestionnaire',query: {userRole:user.users.userRole-2,id: item.questionnaireId,userId:user.users.userId,studentId:item.studentId,state:item.state,publishId:item.publishId}}">
            <el-button>填写问卷</el-button>
          </router-link>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "BeFilledWith",
  mounted() {
    request.get("/getUser").then(res => {
      this.user = res.data
      this.queryUser()
      this.queryQuestionnaire()
    })

  },
  data(){
    return{
      user:[],
      questionnaire:[]
    }
  },
  methods:{
    queryUser(){
      request.get("/getUser").then(res => {
        this.user = res.data
      })
    },
    queryQuestionnaire(){
      request.get("/getUserQuestionnaire").then(res=>{
        this.questionnaire=res.data;
      })
    },
  }
}
</script>

<style>
.be-filled-with .el-collapse-item__header{
  padding-left: 20px;
}

</style>
