<template>
  <div>
    <el-form label-position="left" v-for="(item,index) in questionnaireForm" :key="index"
             status-icon class="questionnaireForm"
             ref="questionnaireForm" label-width="90px">
      <span style="width:auto; display:block; text-align:left;">
        第{{ index + 1 }}题：{{ item.question }}
      </span>
      <el-checkbox-group v-model="answers[index].answer" v-if="item.chooseType===1">
        <el-checkbox align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                     style="display:block;margin-right: 0;margin-left: 0;width: 330px">{{ cb.optionName }}：{{ cb.optionContent }}
        </el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-model="answers[index].answer" v-if="item.chooseType===0">
        <el-radio align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                  style="display:block;margin-right: 0;margin-left: 0;width: 330px">
          {{ cb.optionName }}：{{ cb.optionContent }}
        </el-radio>
      </el-radio-group>
    </el-form>
    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "AnswerQuestionnaire",
  data() {
    return {
      answers: [],
      id: null,
      userId: null,
      questionnaireForm: [],
      questionnaire: [],
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.userId = this.$route.params.userId
    request.get("/getUserQuestions", {"questionnaireId": this.id, "userId": this.userId}).then(res => {
      this.questionnaireForm = res.data;
      for (let i = 0; i < this.questionnaireForm.length; i++) {
        this.answers.push({titleId: this.questionnaireForm[i].titleId, answer: [],score:0})
      }
    })
    request.get("/question", {"id": this.id}).then(res => {
      this.questionnaire = res.data;
    })
  },
  methods: {
    submit() {
      let that = this;
      let submitDate = JSON.parse(JSON.stringify(this.answers));
      for (let i = 0; i < submitDate.length; i++) {
        if(!(submitDate[i].answer instanceof  Array)){
          if (submitDate[i].answer){
            console.log( submitDate[i].answer)
            submitDate[i].answer= new Array( submitDate[i].answer);
          }
        }
        if (submitDate[i].answer.length === 0) {
          this.$message({
            message: '第' + (i+1) + "题还未做答",
            type: 'warning'
          });
          return
        }
      }
      for (let i = 0; i < submitDate.length; i++) {
        submitDate[i].answer.forEach(function (s,num){
          that.questionnaireForm[i].answerOptions.forEach(function (opti,n){
            if (s===opti.optionName){
              submitDate[i].score=submitDate[i].score+opti.optionPoints;
            }
          })
        })
      }
      request.post("/answerQuestionnaire",{
        "answers":submitDate,
        "questionnaireId": this.id,
        "userId": this.userId
      }).then(res=>{
        console.log(1111111111)
      })
    },
  }
}
</script>

<style scoped>

</style>
