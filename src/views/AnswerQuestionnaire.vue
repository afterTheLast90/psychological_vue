<template>
  <div>
    <el-form label-position="left" v-for="(item,index) in questionnaire" :key="index"
             status-icon class="questionnaireForm"
             ref="questionnaireForm" label-width="90px" v-if="state">
      <div v-if="item.chosePeople===role">
        <span style="width:auto; display:block; text-align:left;">
        第{{ item.index }}题：{{ item.question }}
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
      </div>
    </el-form>

    <el-form label-position="left" v-for="(item,index) in questionnaireForm" :key="index"
             status-icon class="questionnaireForm"
             ref="questionnaireForm" label-width="90px" v-if="!state">
      <div v-if="item.chosePeople===role">
        <span style="width:auto; display:block; text-align:left;">
        第{{ item.index }}题：{{ item.question }}
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
      </div>
    </el-form>
    <el-button @click="newSubmit" v-if="state">提交</el-button>
    <el-button @click="oldSubmit" v-if="!state">提交</el-button>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "AnswerQuestionnaire",
  data() {
    return {
      state:null,
      role:0,
      answers: [],
      id: null,
      userId: null,
      studentId:null,
      publishId:null,
      questionnaireForm: [],
      questionnaire: [],
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.role = this.$route.params.userRole
    this.userId = this.$route.params.userId
    this.studentId=this.$route.params.studentId
    this.state=this.$route.params.state
    this.publishId=this.$route.params.publishId
    if (this.state){
      this.queryNewQuestionnaire();
    }else {
      this.queryAnswer();
      this.queryOldQuestionnaire();
    }
  },
  methods: {
    //获取问卷详情
    queryNewQuestionnaire(){
      request.get("/questions", {"id": this.id}).then(res => {
        this.questionnaire = res.data;
        let index =1;
        for (let i = 0; i < this.questionnaire.length; i++) {
          if ( this.questionnaire[i].chosePeople ===this.role){
            this.questionnaire[i].index = index++
          }
            this.answers.push({titleId: this.questionnaire[i].titleId, answer: [],score:0})
        }
      })
    },
    queryOldQuestionnaire(){
      request.get("/getUserQuestions", {"questionnaireId": this.id, "userId": this.studentId}).then(res => {
        this.questionnaireForm = res.data;
        let index =1;
        for (let i = 0; i < this.questionnaireForm.length; i++) {
          if ( this.questionnaireForm[i].chosePeople ===this.role){
            this.questionnaireForm[i].index = index++
          }
          if (this.answers==null){
            this.answers.push({titleId: this.questionnaireForm[i].titleId, answer: [],score:0})
          }
        }
      })
    },
    queryAnswer(){
      request.get("/getUserQuestionnaires",{
        "userId":this.studentId,
        "questionnaireId":this.id,
        "publishId":this.publishId
      }).then(res=>{
        if (res.data.answer!=null){
          this.answers=res.data.answer
        }
      })
    },
    oldSubmit() {
      let that = this;
      let submitDate = JSON.parse(JSON.stringify(this.answers));
      for (let i = 0; i < submitDate.length; i++) {
        if ( this.questionnaireForm[i].chosePeople !==this.role){
          continue;
        }
        if(!(submitDate[i].answer instanceof  Array)){
          if (submitDate[i].answer){
            submitDate[i].answer= new Array( submitDate[i].answer);
          }
        }
        if (submitDate[i].answer.length === 0) {
          this.$message({
            message: '第' + (this.questionnaireForm[i].index) + "题还未做答",
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
        "userId": this.studentId,
        "publishId":this.publishId,
        "role":this.role
      }).then(res=>{
      })
    },
    newSubmit(){
      let that = this;
      let submitDate = JSON.parse(JSON.stringify(this.answers));
      for (let i = 0; i < submitDate.length; i++) {
        if ( this.questionnaire[i].chosePeople !==this.role){
          continue;
        }
        if(!(submitDate[i].answer instanceof  Array)){
          if (submitDate[i].answer){
            submitDate[i].answer= new Array( submitDate[i].answer);
          }
        }
        if (submitDate[i].answer.length === 0) {
          this.$message({
            message: '第' + (this.questionnaire[i].index) + "题还未做答",
            type: 'warning'
          });
          return
        }
      }
      for (let i = 0; i < submitDate.length; i++) {
        submitDate[i].answer.forEach(function (s,num){
          that.questionnaire[i].answerOptions.forEach(function (opti,n){
            if (s===opti.optionName){
              submitDate[i].score=submitDate[i].score+opti.optionPoints;
            }
          })
        })
      }
      request.post("/answerNewQuestionnaire",{
        "answers":submitDate,
        "studentId":this.studentId,
        "publishId":this.publishId,
        "questionnaireId": this.id,
        "userId": this.userId,
        "role":this.role
      }).then(res=>{
      })
    }
  }
}
</script>
