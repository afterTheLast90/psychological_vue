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
          label="是否乱序"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.orderNo ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="问卷状态"
          width="100">
        <template #default="scope">
          <span>{{
              scope.row.questionnaireState === 0 ? "可编辑" : "已确认"
            }}</span>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.questionnaireState!=1"
              @click="handleRelease(scope.$index, scope.row)">发布问卷
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.questionnaireState==0" @click="routeLink2(scope.$index, scope.row)">查看问卷
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="!(scope.row.questionnaireState==0 && (scope.row.creator===user.userId || user.userRole===0))"
              @click="confirm(scope.$index, scope.row)">确认问卷
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="!(scope.row.questionnaireState==0 && (scope.row.creator===user.userId || user.userRole===0))"
              @click="routeLink(scope.$index, scope.row)">编辑问卷
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.questionnaireState==0"
              @click="copy(scope.$index, scope.row)">拷贝问卷
          </el-button>
          <el-button
              size="mini"
              type="danger"
              :disabled="user.userRole==0 ? false :!((scope.row.questionnaireState==0 && (scope.row.creator===user.userId || user.userRole===0)))"
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


    <el-dialog :close-on-click-modal="false" width="35%" title="发布问卷" :visible.sync="releaseFormVisible">

      <el-form :model="releaseParams" status-icon :rules="releaseParamsRules" ref="release">
        <el-form-item label="发布类型" prop="publishType" :label-width="formLabelWidth">
          <el-select v-model="releaseParams.publishType" placeholder="请选择" @change="typeChange">
            <el-option label="地区" :value=0></el-option>
            <el-option label="学校" :value=1></el-option>
            <el-option label="班级" :value=2></el-option>
            <el-option label="学生个人" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="id" :label-width="formLabelWidth"
                      v-if="releaseParams.publishType==2||releaseParams.publishType==3">
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="地区" prop="id" :label-width="formLabelWidth" v-if="releaseParams.publishType==0">
          <el-select v-model="releaseParams.id" placeholder="请选择">
            <el-option
                v-for="area in areas"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="id" :label-width="formLabelWidth" v-if="releaseParams.publishType==1">
          <el-select v-model="releaseParams.id" placeholder="请选择">
            <el-option
                v-for="school in schools"
                :key="school.schoolId"
                :label="school.schoolName"
                :value="school.schoolId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生个人" prop="id" :label-width="formLabelWidth" v-if="releaseParams.publishType==3">
          <el-select v-model="releaseParams.id" placeholder="请选择">
            <el-option
                v-for="student in students"
                :key="student.studentsClass.studentId"
                :label="student.studentName"
                :value="student.studentsClass.studentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="dataTime" :label-width="formLabelWidth">
          <el-date-picker
              @change="handleChangeTime"
              :editable="false"
              v-model="releaseParams.dataTime"
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

    <el-dialog :close-on-click-modal="false" width="35%" title="添加问卷" :visible.sync="addFormVisible">

      <el-form :model="questionnaires" status-icon :rules="rules" ref="questionnaires">
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


    return {
      user: null,
      userId: 192386930036805,
      classId: null,
      publishType: 2,
      areas: [],
      schools: [],
      students: [],
      questionnaire: [],
      options: [],
      selectedOptions: [],
      input: "",
      releaseFormVisible: false,
      addFormVisible: false,
      formLabelWidth: "80px",
      dataTime: ["", ""],
      releaseParams: {
        questionnaireId: null,
        publishType: 2,
        id: null,
        releaseTime: null,
        deadLine: null,
        dataTime: [],
      },
      releaseParamsRules: {
        id: [
          {required: true, message: "请选择", trigger: 'blur'}
        ],
        dataTime: [
          {required: true, message: "请选择发布时间", trigger: 'blur'}
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
          {required: true, message: "请输入问卷名", trigger: 'blur'}
        ],
        questionnaireIntroduction: [
          {required: true, message: "请输入问卷介绍", trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.queryQuestionnaire();
    request.get("/area").then(res => {
      this.areas = res.data
    })
    request.get("/selectSchool").then(res => {
      this.schools = res.data
    })
    request.get("/getUser").then(res => {
      this.user = res.data.users
    })
  },
  methods: {
    typeChange() {
      this.releaseParams.id = null
      this.selectedOptions = [];
    },

    routeLink2(index, row) {
      this.$router.push({name: 'questionnaireDetailsView', query: {id: row.questionnaireId}})
    },
    routeLink(index, row) {
      this.$router.push({name: 'questionnaireDetails', query: {id: row.questionnaireId}})
    },
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
    queryStudents(classId) {
      request.get("/getStudents", {
        "classId": classId
      }).then(res => {
        this.students = res.data
      })
    },
    querySchoolList() {
      request.get("/getSchoolList").then(res => {
        this.options = res.data;
      })
    },
    handleChange(arr) {
      if (this.releaseParams.publishType == 2) {
        this.releaseParams.id = arr[1]
      } else {
        this.queryStudents(arr[1])
      }
    },
    confirm(index, row) {
      request.post("/confirm", null, {"questionnaireId": row.questionnaireId}).then(res => {
        this.queryQuestionnaire();
      })
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
    handleRelease(index, row) {
      this.releaseFormVisible = true;
      this.releaseParams.questionnaireId = row.questionnaireId
      this.querySchoolList();
    },
    handleChangeTime() {
      console.log(this.dataTime)
    },
    releaseSubmit() {
      this.releaseParams.releaseTime = this.releaseParams.dataTime[0];
      this.releaseParams.deadLine = this.releaseParams.dataTime[1];
      console.log(this.releaseParams.dataTime)

      this.$refs['release'].validate((valid) => {
        if (valid) {
          request.post("/release", this.releaseParams).then(res => {
            this.queryQuestionnaire();
            this.releaseFormVisible = false;
          })
        } else {
          return false;
        }
      });
    },
    copy(index, row) {
      request.post("/copy", null, {"questionnaireId": row.questionnaireId}).then(res => {
        this.queryQuestionnaire();
      })
    }
  }
}
</script>

<style>

</style>
