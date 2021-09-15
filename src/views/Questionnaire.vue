<template>
  <div>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="2">
        <h2>问卷管理</h2>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="22">
        <el-button plain style="float: right;" @click="addQuestionnaire">添加问卷</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-input id="findText" v-model="input" placeholder="输入关键字搜索">
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" plain @click="find"></el-button>
        </template>
      </el-input>
    </el-row>
    <el-table
        :data="questionnaire"
        style="width: 100%">
      <el-table-column
          label="问卷名"
          width="150">
        <template #default="scope">
          <i class="el-icon-tickets"></i>
          <span style="margin-left: 10px">{{ scope.row.questionnaireName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="创建人"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="计算方式"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.calculation == 0 ? "因子" : "总分" }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="问卷状态"
          width="100">
        <template #default="scope">
          <span>{{
              scope.row.questionnaireState == 0 ? "未发布" : scope.row.questionnaireState == 1 ? "已发布" : "已截至"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="提交人数"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.submissionNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="发布时间"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.releaseTime == null ? "未发布" : scope.row.releaseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="截至时间"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.deadline == null ? "未发布" : scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleAddParent(scope.$index, scope.row)">查看结果
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleRelease(scope.$index, scope.row)">发布问卷
          </el-button>
          <router-link :to="{name:'questionnaireDetails',params: {id: scope.row.questionnaireId}}">
            <el-button
                size="mini"
                type="primary"
                :disabled="scope.row.state===1">编辑问卷
            </el-button>
          </router-link>
          <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.state===1"
              @click="handleDel(scope.$index, scope.row)">删除问卷
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="changePageSize"
        @current-change="changePageNumber"
        :current-page="page.pageNum"
        :page-sizes="[1,2,3]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
    </el-pagination>

    <div>
      <el-dialog width="35%" title="发布问卷" :visible.sync="releaseFormVisible">

        <el-form :model="releaseParams" status-icon :rules="releaseParamsRules" class="releaseParams" ref="releaseParams">
            <el-form-item label="班级" prop="classes" :label-width="formLabelWidth">
              <el-cascader
                  v-model="selectedOptions"
                  :options="options"
                  @change="handleChange"></el-cascader>
            </el-form-item>
          <el-form-item label="时间" prop="time" :label-width="formLabelWidth">
            <el-date-picker
                @change="handleChangeTime"
                :editable="false"
                v-model="dataTime"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="releaseFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="releaseSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog width="35%" title="添加问卷" :visible.sync="addFormVisible">

        <el-form :model="questionnaires" status-icon :rules="rules" class="questionnaires" ref="questionnaires">
          <el-form-item label="问卷名称" prop="questionnaireName" :label-width="formLabelWidth">
            <el-input v-model="questionnaires.questionnaireName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="问卷简介" prop="questionnaireIntroduction" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="questionnaires.questionnaireIntroduction" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addQuestionnaireSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  data() {
    let validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('问卷名称不能为空'))
      }
      callback();
    };
    let validateIntroduction = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('问卷简介不能为空'))
      }
      callback();
    };
    let validateClasses = (rule, value, callback) => {
      if (value === '' && value ===null) {
        callback(new Error('班级不能为空'))
      }
      callback();
    };
    let validateTime = (rule, value, callback) => {
      if (value === '' && value ===null) {
        callback(new Error('时间不能为空'))
      }
      callback();
    };
    return {
      questionnaire: [],
      options: [],
      selectedOptions: [],
      input: "",
      releaseFormVisible: false,
      addFormVisible: false,
      formLabelWidth: "80px",
      dataTime:["",""],
      releaseParams:{
        questionnaireId:null,
        schoolId:null,
        classId:null,
        releaseTime:null,
        deadLine:null,
      },
      releaseParamsRules:{
        classes: [
          {validator: validateClasses, trigger: 'blur'}
        ],
        time: [
          {validator: validateTime, trigger: 'blur'}
        ],
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: "",
      },
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      questionnaires: {
        questionnaireName: "",
        questionnaireIntroduction: ""
      },
      rules: {
        questionnaireName: [
          {validator: validateName, trigger: 'blur'}
        ],
        questionnaireIntroduction: [
          {validator: validateIntroduction, trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.queryQuestionnaire();
  },
  methods: {
    queryQuestionnaire() {
      request.get("/selectQuestionnaire", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.questionnaire = data.data;
      })
    },
    querySchoolList() {
      request.get("/getSchoolList").then(res => {
        this.options = res.data;
      })
    },
    handleChange(arr) {
      this.releaseParams.classId = arr[1];
      this.releaseParams.schoolId=arr[0];
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryQuestionnaire()
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryQuestionnaire()
    },
    addQuestionnaire() {
      this.addFormVisible = true;
      this.resetForm();
      this.questionnaires.questionnaireName = "";
      this.questionnaires.questionnaireIntroduction = "";
    },
    addQuestionnaireSubmit() {
      this.$refs["questionnaires"].validate((valid) => {
        if (valid) {
          request.post("/insertQuestionnaire", null, {
            creator: 192386930036805,
            introduction: this.questionnaires.questionnaireIntroduction,
            name: this.questionnaires.questionnaireName
          }).then(res => {
            this.queryQuestionnaire();
            this.addFormVisible = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["questionnaires"].clearValidate();
      })
    },
    find() {
      this.queryParams.value = this.input;
      this.queryQuestionnaire();
    },
    handleDel(index, row) {
      request.post("/delQuestionnaire", null, {
        id: row.questionnaireId
      }).then(res => {
        this.queryQuestionnaire();
      })
    },
    handleRelease(index,row){
      this.releaseFormVisible=true;
      this.releaseParams.questionnaireId=row.questionnaireId
      this.querySchoolList();
    },
    handleChangeTime(){
      console.log(this.dataTime)
    },
    releaseSubmit() {
      console.log(this.dataTime)
      this.releaseParams.releaseTime=this.dataTime[0];
      this.releaseParams.deadLine=this.dataTime[1];
      this.$refs["releaseParams"].validate((valid) => {
        if (valid) {
          request.post("/release", this.releaseParams).then(res => {
            this.queryQuestionnaire();
            this.releaseFormVisible = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style>

</style>
