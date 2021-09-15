<template>
  <div>
    <el-collapse v-for="(item,index) in questionnaire" :key="index" accordion>
      <el-collapse-item :title="item.questionnaireName">
        <div>创建人：{{item.creatorName}}</div>
        <div>问卷简介：{{item.questionnaireIntroduction}}</div>
        <div>时间：{{item.releaseTime+"~"+item.deadline}}</div>
        <router-link :to="{name:'answerQuestionnaire',params: {id: item.questionnaireId,userId:200878151622725}}">
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
      questionnaire:[]
    }
  },
  methods:{
    queryQuestionnaire(){
      request.get("/getUserQuestionnaire",{
        userId:200878151622725
      }).then(res=>{
        console.log(res.data)
        this.questionnaire=res.data;
      })
    },
    fillIn(questionnaireId){

    }
  }
}
</script>

<style scoped>

</style>
