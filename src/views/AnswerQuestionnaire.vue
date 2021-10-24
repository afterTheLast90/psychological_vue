<template>
  <div>
    <el-form label-position="left" v-for="(item,index) in questionnaire" :key="index"
             status-icon class="questionnaireForm"
             style="margin: 15px 0 35px;"
             ref="questionnaireForm" label-width="90px" v-if="state">
      <div v-if="item.chosePeople===role">
        <span style="width:auto; display:block; text-align:left;">
        第{{ item.index }}题：
          <span v-if="!item.questionType">{{ item.question }}</span>
          <el-image v-if="item.questionType" style="display: block;margin: 5px 0 10px; max-width: 600px"
                    :src="getUrl(item.question)"></el-image>
      </span>
        <el-checkbox-group v-model="answers[index].answer" v-if="item.chooseType===1">
          <el-checkbox align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                       style="display:block;margin-right: 0;margin-left: 0;width: 330px;height: auto;border: none">
            {{ cb.optionName }}：<span v-if="!cb.optionType">{{ cb.optionContent }}</span>
            <el-image v-if="cb.optionType" :src="getUrl(cb.optionContent)"></el-image>
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-model="answers[index].answer" v-if="item.chooseType===0">
          <el-radio align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                    style="display:block;margin-right: 0;margin-left: 0;width: 330px;height: auto;border: none">
            {{ cb.optionName }}：<span v-if="!cb.optionType">{{ cb.optionContent }}</span>
            <el-image v-if="cb.optionType" style="display: block;margin: 5px 0 10px;"
                      :src="getUrl(cb.optionContent)"></el-image>
          </el-radio>
        </el-radio-group>
      </div>
    </el-form>


    <el-form label-position="left" v-for="(item,index) in questionnaireForm" :key="index"
             status-icon class="questionnaireForm"
             style="margin: 15px 0 35px;"
             ref="questionnaireForm" label-width="90px" v-if="!state">
      <div v-if="item.chosePeople===role">
        <span style="width:auto; display:block; text-align:left;">
        第{{ item.index }}题：
          <span v-if="!item.questionType">{{ item.question }}</span>
          <el-image v-if="item.questionType" style="display: block;margin: 5px 0 10px;"
                    :src="getUrl(item.question)"></el-image>
      </span>
        <el-checkbox-group v-model="answers[index].answer" v-if="item.chooseType===1">
          <el-checkbox align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                       style="display:block;margin-right: 0;margin-left: 0;width: 330px;height: auto;border: none">
            {{ cb.optionName }}：<span v-if="!cb.optionType">{{ cb.optionContent }}</span>
            <el-image v-if="cb.optionType" :src="getUrl(cb.optionContent)"></el-image>
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-model="answers[index].answer" v-if="item.chooseType===0">
          <el-radio align="left" border :label="cb.optionName" v-for="(cb, i) in item.answerOptions" :key="i"
                    style="display:block;margin-right: 0;margin-left: 0;width: 330px;height: auto;border: none">
            {{ cb.optionName }}：<span v-if="!cb.optionType">{{ cb.optionContent }}</span>
            <el-image v-if="cb.optionType" style="display: block;margin: 5px 0 10px;"
                      :src="getUrl(cb.optionContent)"></el-image>
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
      orderNo:null,
      state: null,
      role: 0,
      answers: [],
      id: null,
      userId: null,
      studentId: null,
      publishId: null,
      questionnaireForm: [],
      questionnaire: [],
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.role = Number.parseInt(this.$route.query.userRole);
    this.userId = this.$route.query.userId
    this.studentId = this.$route.query.studentId
    this.state = this.$route.query.state
    this.publishId = this.$route.query.publishId
    if (this.state===null){
      this.$router.push({name: 'beFilledWith'})
    }
    request.get("/question",{"id":this.id}).then(res=>{
      this.orderNo=res.data.orderNo;
      console.log(this.orderNo)
    })
    console.log(this.id)
    if (this.state) {
      this.queryNewQuestionnaire();
    } else {
      this.queryAnswer().then(res => {
        this.queryOldQuestionnaire();
      });
    }
  },
  methods: {
    getUrl(url){
      return request.baseUrl+url;
    },
    shuffle(arr1, arr2) {
      let result1 = new Array(), randomIndex;
      let result2 = new Array();

      // 条件判断,只要arr.length > 0 就走while循环里面的
      while (arr1.length > 0) {
        randomIndex = Math.floor(Math.random() * arr1.length) // 得到数组范围内下标
        result1.push(arr1[randomIndex])
        result2.push(arr2[randomIndex])
        arr1.splice(randomIndex, 1)
        arr2.splice(randomIndex, 1)
      }
      return {result1: result1, result2: result2};
    },
    //获取问卷详情
    queryNewQuestionnaire() {
      request.get("/questions", {"id": this.id}).then(res => {
        this.questionnaire = res.data;
        let index = 1;
        for (let i = 0; i < this.questionnaire.length; i++) {
          this.answers.push({titleId: this.questionnaire[i].titleId, answer: [], score: 0})
        }
        if (this.orderNo){
          res = this.shuffle(this.questionnaire, this.answers);
          this.questionnaire = res.result1;
          this.answers = res.result2;
        }
        for (let i = 0; i < this.questionnaire.length; i++) {
          if (this.questionnaire[i].chosePeople === this.role) {
            this.questionnaire[i].index = index++
          }
        }
      })
    },
    queryOldQuestionnaire() {
      request.get("/getUserQuestions", {"questionnaireId": this.id, "userId": this.studentId}).then(res => {
        this.questionnaireForm = res.data;
        let index = 1;
        if (!this.answers) {
          for (let i = 0; i < this.questionnaireForm.length; i++) {
            this.answers.push({titleId: this.questionnaireForm[i].titleId, answer: [], score: 0})
          }
        }
        if (this.orderNo){
          res = this.shuffle(this.questionnaireForm, this.answers);
          this.questionnaireForm = res.result1;
          this.answers = res.result2;
        }

        for (let i = 0; i < this.questionnaireForm.length; i++) {
          if (this.questionnaireForm[i].chosePeople === this.role) {
            this.questionnaireForm[i].index = index++
          }
        }
      })
    },
    queryAnswer() {
      return request.get("/getUserQuestionnaires", {
        "userId": this.studentId,
        "questionnaireId": this.id,
        "publishId": this.publishId
      }).then(res => {
        if (res.data.answer != null) {
          this.answers = res.data.answer
        }
      })
    },
    oldSubmit() {
      let that = this;
      let submitDate = JSON.parse(JSON.stringify(this.answers));
      for (let i = 0; i < submitDate.length; i++) {
        if (this.questionnaireForm[i].chosePeople !== this.role) {
          continue;
        }
        if (!(submitDate[i].answer instanceof Array)) {
          if (submitDate[i].answer) {
            submitDate[i].answer = new Array(submitDate[i].answer);
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
        if (this.questionnaireForm[i].chosePeople !== this.role) {
          continue;
        }
        submitDate[i].answer.forEach(function (s, num) {
          that.questionnaireForm[i].answerOptions.forEach(function (opti, n) {
            if (s === opti.optionName) {
              submitDate[i].score = submitDate[i].score + opti.optionPoints;
            }
          })
        })
      }
      submitDate.sort(function(a, b){return a.titleId-b.titleId})
      request.post("/answerQuestionnaire", {
        "answers": submitDate,
        "questionnaireId": this.id,
        "userId": this.studentId,
        "publishId": this.publishId,
        "role": this.role
      }).then(res => {
        this.$router.push({name: 'beFilledWith'})
      }).catch(res=>{
        this.$router.push({name: 'beFilledWith'})
      })
    },
    newSubmit() {
      let that = this;
      let submitDate = JSON.parse(JSON.stringify(this.answers));
      for (let i = 0; i < submitDate.length; i++) {
        if (this.questionnaire[i].chosePeople !== this.role) {
          continue;
        }
        if (!(submitDate[i].answer instanceof Array)) {
          if (submitDate[i].answer) {
            submitDate[i].answer = new Array(submitDate[i].answer);
          }else{
            submitDate[i].answer = new Array();
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
        if (this.questionnaire[i].chosePeople !== this.role) {
          continue;
        }
        submitDate[i].answer.forEach(function (s, num) {
          that.questionnaire[i].answerOptions.forEach(function (opti, n) {
            if (s === opti.optionName) {
              submitDate[i].score = submitDate[i].score + opti.optionPoints;
            }
          })
        })
      }
      submitDate.sort(function(a, b){return a.titleId-b.titleId})
      request.post("/answerNewQuestionnaire", {
        "answers": submitDate,
        "studentId": this.studentId,
        "publishId": this.publishId,
        "questionnaireId": this.id,
        "userId": this.userId,
        "role": this.role
      }).then(res => {
        this.$router.push({name: 'beFilledWith'})
      })
    }
  }
}
</script>
<style scoped>
.el-radio-group{
  display: block;
}
</style>
