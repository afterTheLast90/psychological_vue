<template>
  <div>
    <el-collapse v-for="(item,index) in questionnaire" :key="index" accordion>
      <el-collapse-item :title="item.questionnaireName">
        <div>创建人：{{item.creatorName}}</div>
        <div>问卷简介：{{item.questionnaireIntroduction}}</div>
        <div>时间：{{item.releaseTime+"~"+item.deadLine}}</div>
        <div>学生：{{item.studentName}}</div>
        <div>学生：{{item.studentId}}</div>
        <div>{{item.state}}</div>
        <router-link :to="{name:'answerQuestionnaire',params: {id: item.questionnaireId,userId:userId,studentId:item.studentId,state:item.state,publishId:item.publishId}}">
          <el-button>填写问卷</el-button>
        </router-link>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "BeFilledWith",
  mounted() {
    this.queryQuestionnaire()
  },
  data(){
    return{
      userId:200877915885637,
      questionnaire:[]
    }
  },
  methods:{
    queryQuestionnaire(){
      request.get("/getUserQuestionnaire",{
        userId:this.userId
      }).then(res=>{
        console.log(res.data)
        this.questionnaire=res.data;
      })
    },
  }
}
</script>

<style scoped>

</style>
