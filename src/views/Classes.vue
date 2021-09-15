<template>
  <div>
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
        <el-select v-model="class1.schoolId" placeholder="请选择学校">
          <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
          </el-option>
        </el-select>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-select v-model="class1.teacherId" placeholder="请选择教师">
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
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.state===1"
              @click="handleDelete(scope.$index, scope.row)">删除
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
      <el-dialog width="35%" title="添加班级" :visible.sync="addFormVisible">

        <el-form :model="class1" status-icon :rules="rules" class="class1" ref="class1">
          <el-row style="margin-left: 0px; margin-right: 0px">
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="学校" prop="schoolId" :label-width="formLabelWidth">
                <el-select v-model="class1.schoolId" placeholder="请选择学校">
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
              <el-form-item label="教师" prop="teacherId" :label-width="formLabelWidth">
                <el-select v-model="class1.teacherId" placeholder="请选择教师">
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
      <el-dialog width="35%" title="修改班级" :visible.sync="editFormVisible">

        <el-form :model="class1" status-icon :rules="rules" class="class1" ref="class1">
          <el-row style="margin-left: 0px; margin-right: 0px">
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="学校" prop="schoolId" :label-width="formLabelWidth">
                <el-select v-model="class1.schoolId" placeholder="请选择学校">
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
              <el-form-item label="教师" prop="teacherId" :label-width="formLabelWidth">
                <el-select v-model="class1.teacherId" placeholder="请选择教师">
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
      }
      callback();
    };
    return {
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
    }
  },
  mounted() {
    this.queryClasses();
    this.queryTeacher();
    this.querySchool();
  },
  methods: {
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
