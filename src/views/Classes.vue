<template>
  <div>
    <el-dialog title="导入信息" :visible.sync="importStudentFailedVisible">
      一共{{importFailed.size}}条数据，{{importFailed.total}}条导入失败。
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" @click="importStudentFailedVisible = false">取 消</el-button>
        <el-button type="primary" @click="downloadFailedInfo">下载数据</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入学生" :visible.sync="importStudentVisible">
      <el-form>
        <el-form-item label="文件" :label-width="formLabelWidth">
          <el-upload
              :before-upload="beforeFile"
              :headers="headers"
              :on-success="successFile"
              drag
              :action="getUrl('/upload/parseExcel')"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xsl/xlsx文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" @click="importStudentVisible = false">取 消</el-button>
        <el-link style="margin-right: 20px" :href="getUrl('/upload/import_student_template.xlsx')">
          <el-button>下载模板</el-button>
        </el-link>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="2">
        <h2>班级管理</h2>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="22">
        <el-button plain style="float: right;" @click="addClasses">添加班级</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-select v-model="class1.schoolId" placeholder="请选择学校" v-if="userRole!=4">
          <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
          </el-option>
        </el-select>
        <el-select v-model="class1.schoolId" placeholder="请选择学校" :disabled="true" v-if="userRole==4">
          <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
          </el-option>
        </el-select>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-select v-model="class1.teacherId" placeholder="请选择教师" v-if="userRole!=4">
          <el-option
              v-for="item in teacher"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
          </el-option>
        </el-select>
        <el-select v-model="class1.teacherId" placeholder="请选择教师" :disabled="true" v-if="userRole==4">
          <el-option
              v-for="item in teacher"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :offset="1" style="padding-left:0px; padding-right: 0px" :span="17">
        <el-input id="findText" v-model="input" placeholder="输入关键字搜索">
          <template slot="append">
            <el-button type="primary" icon="el-icon-search" plain @click="find"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
        :data="classes"
        style="width: 100%">
      <el-table-column
          label="学校"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.schoolName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="年级"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="班级"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="教师"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.teacherName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleImportStudent(scope.row.classId)">导入学生
          </el-button>

          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              :disabled="scope.row.state===1"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除-->
<!--          </el-button>-->
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
      <el-dialog :close-on-click-modal="false" width="35%" title="添加班级" :visible.sync="addFormVisible">

        <el-form :model="class1" status-icon :rules="rules" class="class1" ref="class1">
          <el-row style="margin-left: 0px; margin-right: 0px">
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="学校" prop="schoolId" :label-width="formLabelWidth" v-if="userRole!=4">
                <el-select v-model="class1.schoolId" placeholder="请选择学校" >
                  <el-option
                      v-for="item in schools"
                      :key="item.schoolId"
                      :label="item.schoolName"
                      :value="item.schoolId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="教师" prop="teacherId" :label-width="formLabelWidth" v-if="userRole!=4">
                <el-select v-model="class1.teacherId" placeholder="请选择教师" >
                  <el-option
                      v-for="item in teacher"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="年级" prop="grade" :label-width="formLabelWidth">
            <el-input v-model="class1.grade" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班级名" prop="className" :label-width="formLabelWidth">
            <el-input v-model="class1.className" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClassesSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="修改班级" :visible.sync="editFormVisible">

        <el-form :model="class1" status-icon :rules="rules" class="class1" ref="class1">
          <el-row style="margin-left: 0px; margin-right: 0px">
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="学校" prop="schoolId" :label-width="formLabelWidth" v-if="userRole!=4">
                <el-select v-model="class1.schoolId" placeholder="请选择学校" >
                  <el-option
                      v-for="item in schools"
                      :key="item.schoolId"
                      :label="item.schoolName"
                      :value="item.schoolId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="教师" prop="teacherId" :label-width="formLabelWidth" v-if="userRole!=4">
                <el-select v-model="class1.teacherId" placeholder="请选择教师" >
                  <el-option
                      v-for="item in teacher"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="年级" prop="grade" :label-width="formLabelWidth">
            <el-input v-model="class1.grade" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班级名" prop="className" :label-width="formLabelWidth">
            <el-input v-model="class1.className" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassesSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  data() {
    let validateTeacherId = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('教师不能为空'))
      }
      callback();
    };
    let validateSchoolId = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('学校不能为空'))
      }
      callback();
    };
    let validateClassName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('班级名不能为空'))
      }
      callback();
    };
    let validateGrade = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('年级不能为空'))
      }else if(!/^\d+$/.test(value)){
        callback(new Error("年级为整数"))
      }
      callback();
    };
    return {
      importForm: {
        classId: "",
        data: []
      },
      importFailed:{
        data:[],
        size:0,
        total:0,
      },
      importStudentVisible: false,
      importStudentFailedVisible:false,
      aUser:{},
      classes: [],
      teacher: [],
      schools: [],
      input:"",
      formLabelWidth: '80px',
      editFormVisible: false,
      addFormVisible: false,
      class1: {
        id: 111,
        teacherId: null,
        schoolId: null,
        className: "",
        grade: null,
      },
      rules: {
        teacherId: [
          {validator: validateTeacherId, trigger: 'blur'}
        ],
        schoolId: [
          {validator: validateSchoolId, trigger: 'blur'}
        ],
        className: [
          {validator: validateClassName, trigger: 'blur'}
        ],
        grade: [
          {validator: validateGrade, trigger: 'blur'}
        ],
      },
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teacherId: null,
        schoolId: null,
        value: "",
      },
      userRole:0
    }
  },
  computed: {
    headers() {
      return {
        "satoken": localStorage.getItem("sa-token"),
      }
    }
  },
  mounted() {
    this.userRole=Number.parseInt(localStorage.getItem('userRole'));

    request.get("/getUser").then(res=>{
      console.log(res)
      this.aUser=res.data
    })

    this.queryClasses();
    this.queryTeacher();
    this.querySchool();
  },
  methods: {
    downloadFailedInfo(){
      // this.importStudentFailedVisible =false;
      request.download("/downloadImportFailedStudentInfo",{
        list:this.importFailed.data
      });
    },
    getUrl(url){
      return request.baseUrl + url;
    },
    handleImportStudent(classId){
      this.importForm.classId=classId;
      this.importStudentVisible=true;
    },
    beforeFile(file) { //上传文件之前的钩子 判断文件格式
      let index = file.name.lastIndexOf('.');
      let filetype = file.name.slice(index + 1);
      if (filetype === 'xls' || filetype === 'xlsx') {
        if (file.size<1024*1024*10)
          return true
        else{
          this.$message.error('文件大小超过10M');
          return false
        }
      } else {
        this.$message.error('文件格式错误，请选择 xls 或 xlsx 格式的文件！');
        return false
      }
    },
    submit() {
      if (!this.importForm.data){
        this.$message.error('请选择文件');
        return;
      }
      if (!this.importForm.classId){
        this.$message.error('请选择班级');
        return;
      }
      request.post("/importStudent",this.importForm).then(res=>{
        this.importStudentVisible=false;
        if (res.data.size===0){
          this.$message.success("导入成功");
        }else{
          this.importFailed=res.data;
          this.importStudentFailedVisible = true;
        }
      })
    },
    successFile(response, file, fileList) {
      this.importForm.data=response.data;
      if (!this.importForm.data){
        this.$message.error('无数据');
      }
    },
    queryClasses() {
      request.get("/selectClasses", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.classes = data.data;
      })
    },
    queryTeacher() {
      request.get("/getTeacherArray").then(res => {
        this.teacher = res.data;
      })
    },
    querySchool() {
      request.get("/selectSchool").then(res => {
        this.schools = res.data;
      })
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryClasses();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryClasses();
    },
    addClasses() {
      this.class1.grade = null;
      this.class1.className = "";
      this.class1.id = null;
      this.class1.teacherId = null;
      this.class1.schoolId = null;
      this.resetForm();
      this.queryTeacher();
      this.querySchool();
      this.addFormVisible = true;
    },
    handleEdit(index, row) {
      this.class1.id = row.classId;
      this.class1.className = row.className;
      this.class1.teacherId = row.teacherId;
      this.class1.schoolId = row.schoolId;
      this.class1.grade = row.grade;
      this.resetForm();
      this.querySchool();
      this.queryTeacher();
      this.editFormVisible = true;
    },
    editClassesSubmit() {
      this.$refs["class1"].validate((valid) => {
        if (valid) {
          this.editFormVisible = false;
          request.post("/modifyClasses", {
            classId: this.class1.id,
            className: this.class1.className,
            teacherId: this.class1.teacherId,
            schoolId: this.class1.schoolId,
            grade: this.class1.grade,
          }).then(res => {
            this.queryClasses();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addClassesSubmit() {
      this.$refs["class1"].validate((valid) => {
        if (valid) {
          this.addFormVisible = false;
          request.post("/insertClasses", {
            classId: this.class1.id,
            className: this.class1.className,
            teacherId: this.aUser.users.userId,
            schoolId: 111,
            grade: this.class1.grade,
          }).then(res => {
            this.queryClasses();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleDelete(index,row){
      request.post("/delClasses",null,{
        classId:row.classId
      }).then(res=>{
        this.queryClasses();
      })
    },
    find(){
      this.queryParams.schoolId=this.class1.schoolId;
      this.queryParams.teacherId=this.class1.teacherId;
      this.queryParams.value=this.input;
      this.queryClasses();
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["class1"].clearValidate();
      })

    }
  }
}
</script>

<style scoped>

</style>
