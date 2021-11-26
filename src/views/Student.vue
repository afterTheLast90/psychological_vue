<template>
  <div>

    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="2">
        <h2>学生管理</h2>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="22">
        <el-button plain style="float: right;" @click="addStudent">添加学生</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-cascader
            v-model="selectedOptions"
            :options="options"
            @change="handleChange"></el-cascader>
      </el-col>
      <el-col :offset="1" style="padding-left:0px; padding-right: 0px" :span="20">
        <el-input id="findText" v-model="input" placeholder="输入关键字搜索">
          <template slot="append">
            <el-button type="primary" icon="el-icon-search" plain @click="find"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
        :data="students"
        style="width: 100%">
      <el-table-column
          label="用户名"
          width="120">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="性别"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.userGender === 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="年龄"
          width="100">
        <template #default="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="学校"
          width="120">
        <template #default="scope">
          <span>{{ scope.row.classes[0].schoolName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--          label="手机号"-->
      <!--          width="120">-->
      <!--        <template #default="scope">-->
      <!--          <span>{{ scope.row.userPhoneNumber }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--          label="手机验证"-->
      <!--          width="100">-->
      <!--        <template #default="scope">-->
      <!--          <el-tag :type="scope.row.phoneNumberChecked===1?'success':'warning'" effect="dark">-->
      <!--            {{ scope.row.phoneNumberChecked === 1 ? "已验证" : "未验证" }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column
          label="家长"
          width="120">
        <template #default="scope">
          {{scope.row.parents[0].parentName}}
          <!--          <el-tag v-for="item in scope.row.parents" :key="item.classId">{{ item.parentName }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
          label="班级"
          width="500">
        <template #default="scope">
          <!--          {{scope.row.classes[0].className}}-->
          <el-tag v-for="item in scope.row.classes" :key="item.classId">{{ item.className }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="info"
              @click="handleDisable(scope.$index, scope.row)">{{ scope.row.state === 0 ? "禁用" : "启用" }}
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleAddParent(scope.$index, scope.row)">编辑家长
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleEditClass(scope.$index, scope.row)">加入班级
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleEdit(scope.$index, scope.row)">编辑学生
          </el-button>
          <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.state===1"
              @click="handleDeleteClass(scope.$index, scope.row)">退出班级
          </el-button>
          <!--          <el-button-->
          <!--              size="mini"-->
          <!--              type="danger"-->
          <!--              :disabled="scope.row.state===1"-->
          <!--              @click="handleDelete(scope.$index, scope.row)">删除学生-->
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


    <el-dialog :close-on-click-modal="false" title="添加学生" :visible.sync="addFormVisible" width="35%" top="15px">
      <el-form :model="registerForm" :rules="registerFormRules" ref="registerForm">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="registerForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userGender">
          <el-select v-model="registerForm.userGender"
                     style="width: 100%">
            <el-option :value="1" label="男">男</el-option>
            <el-option :value="0" label="女">女</el-option>
          </el-select>
          <!--          <el-input v-model="registerForm.userGender" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model="registerForm.rePassword" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="userBirthday">
          <el-date-picker
              style="width: 100%"
              v-model="registerForm.userBirthday"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-cascader
              style="width: 100%"
              v-model="selectedOptions"
              :options="options"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="家长姓名" prop="parentName">
          <el-input v-model="registerForm.parentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="家长手机号" prop="parentPhone">
          <br>
          <el-input v-model="registerForm.parentPhone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible=!addFormVisible">取 消</el-button>
        <el-button type="primary" @click="registerAccount('registerForm')">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="编辑学生" :visible.sync="editFormVisible">

        <el-form :model="user" status-icon :rules="rules" class="user" ref="user">
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="user.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account" :label-width="formLabelWidth">
            <el-input v-model="user.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-row style="margin-left: 0px; margin-right: 0px">
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                <el-select v-model="user.gender" placeholder="男/女">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="padding-left: 0px; padding-right: 0px" :span="10">
              <el-form-item label="出生日期" prop="birthday" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="user.birthday"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-form-item label="手机号" prop="phone_number" :label-width="formLabelWidth">-->
          <!--            <el-input v-model="user.phone_number" autocomplete="off"></el-input>-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editStudentSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="加入班级" :visible.sync="editClassFormVisible">
        <el-form>
          <el-form-item label="班级" prop="name" :label-width="formLabelWidth">
            <el-cascader
                v-model="selectedOptions"
                :options="options"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="editClassFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSchoolSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="编辑家长" :visible.sync="editParentFormVisible">
        <el-form :model="parent" status-icon :rules="rules" class="user" ref="user">
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="parent.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account" :label-width="formLabelWidth">
            <el-input v-model="parent.userAccount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input type="password" v-model="parent.userPassword" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone_number" :label-width="formLabelWidth">
            <el-input v-model="parent.userPhoneNumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="editParentFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParentSubmit">提 交</el-button>
        </div>
<!--        <el-form>-->
<!--          <el-form-item label="家长" prop="name" :label-width="formLabelWidth">-->
<!--            <el-select v-model="parentId" placeholder="请选择家长">-->
<!--              <el-option-->
<!--                  v-for="item in parent"-->
<!--                  :key="item.parentId"-->
<!--                  :label="item.parentName"-->
<!--                  :value="item.parentId">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="resetForm">重 置</el-button>-->
<!--          <el-button @click="formLabelWidth = false">取 消</el-button>-->
<!--          <el-button type="primary" @click="editParentSubmit">提 交</el-button>-->
<!--        </div>-->
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="退出班级" :visible.sync="delClassFormVisible">
        <el-form>
          <el-form-item label="学校名称" prop="name" :label-width="formLabelWidth">
            <el-select v-model="aClassId">
              <el-option
                  v-for="item in aClass"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="delSchoolSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import request from "../utils/request";
import {Message} from "element-ui";

export default {
  data() {
    let validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      }
      callback();
    };
    let validateParentId = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('家长不能为空'))
      }
      callback();
    };
    let validateClassId = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('班级不能为空'))
      }
      callback();
    };
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      }
      callback();
    };
    let validatePhoneNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      }
      callback();
    };
    let validateBirthday = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('出生日期不能为空'))
      } else if (value > new Date()) {
        callback(new Error('出生日期不得大于当前时间'))
      }
      callback();
    };
    let validateGender = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('性别不能为空'))
      }
      callback();
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback();
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {

      registerForm: {
        account: "",
        password: "",
        userGender: 1,
        userBirthday: "",
        userName: "",
        rePassword: "",
        classId: "",
        parentName: "",
        parentPhone: ""
      },
      registerFormRules: {
        account: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ],
        userGender: [
          {required: true, message: '性别不可为空', trigger: 'blur'}
        ],
        userBirthday: [
          {required: true, message: '生日不可为空', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '姓名不可为空', trigger: 'blur'}
        ],
        rePassword: [
          {required: true, message: '重复密码不可为空', trigger: 'blur'}
        ],
        classId: [
          {required: true, message: '班级id不可为空', trigger: 'blur'}
        ],
        parentName: [
          {required: true, message: '父母姓名不可为空', trigger: 'blur'}
        ],
        parentPhone: [
          {required: true, message: '父母手机号不可为空', trigger: 'blur'}
        ],
      },
      parentId: null,
      students: [],
      options: [],
      selectedOptions: [],
      aClass: [],
      parent: {},
      parents: [],
      input: "",
      aClassId: null,
      aParentId: null,
      studentId: null,
      formLabelWidth: "80px",
      editParentFormVisible: false,
      addParentFormVisible: false,
      delClassFormVisible: false,
      editClassFormVisible: false,
      addFormVisible: false,
      editFormVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: "",
        classId: ""
      },
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      user: {
        id: null,
        name: "",
        account: "",
        password: "",
        check_password: "",
        birthday: null,
        gender: "",
        phone_number: "",
        classId: null,
        parentId: null
      },
      rules: {
        parentId: [
          {validator: validateParentId, trigger: 'blur'}
        ],
        name: [
          {validator: validateName, trigger: 'blur'}
        ],
        classId: [
          {validator: validateClassId, trigger: 'blur'}
        ],
        account: [
          {validator: validateAccount, trigger: 'blur'}
        ],
        phone_number: [
          {validator: validatePhoneNumber, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        birthday: [
          {validator: validateBirthday, trigger: 'blur'}
        ],
        gender: [
          {validator: validateGender, trigger: 'blur'}
        ],
        check_password: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.queryUsers();
    this.querySchoolList();
    // this.queryParent();
  },
  methods: {
    queryParent(parentId) {
      request.get("/getParent",{"parentId" : parentId}).then(res => {
        this.parent = res.data
      })
    },
    queryUsers() {
      request.get("/getStudentList", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.students = data.data;
      })
    },
    querySchoolList() {
      request.get("/getSchoolList").then(res => {
        this.options = res.data;
      })
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryUsers();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryUsers();
    },
    addStudent() {
      this.addFormVisible = true;
      this.user.name = "";
      this.user.account = "";
      this.user.password = "";
      this.user.check_password = "";
      this.user.gender = "";
      this.user.phone_number = "";
      this.user.birthday = null;
      this.value = "";
      this.resetForm();
    },
    handleChange(arr) {
      if (localStorage.getItem("userRole")==4){
        this.user.classId = arr[0];
        this.registerForm.classId=arr[0];
      }else {
        this.user.classId = arr[1];
        this.registerForm.classId=arr[1];
      }
    },
    handleDisable(index, row) {
      console.log(row.state)
      request.post("/changeUserState/" + row.userId, {}, {
        state: row.state !== 0 // row.state===0?false:true
      }).then(res => {
        this.queryUsers();
      }).then(res => {
      });
    },
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.user.id = row.userId;
      this.user.name = row.userName;
      this.user.account = row.userAccount;
      this.user.password = row.userPassword;
      this.user.gender = row.userGender === 1 ? "男" : "女";
      this.user.phone_number = row.userPhoneNumber;
      this.user.birthday = row.userBirthday;
      this.resetForm();
    },
    editStudentSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          request.post("/modifyStudent", {
            "userId": this.user.id,
            "userAccount": this.user.account,
            "userBirthday": this.user.birthday,
            "userGender": this.user.gender === "男" ? 1 : 0,
            "userName": this.user.name,
            "userPassword": this.user.password,
            "userPhoneNumber": 13777777777
          }).then(res => {
            this.queryUsers();
            this.editFormVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editParentSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          request.post("/modifyUser",this.parent).then(res => {
            this.queryUsers();
            this.editParentFormVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleDelete(index, row) {
      request.post("/deleteUser/" + row.userId).then(res => {

      }).then(res => {
        this.queryUsers();
      });
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["user"].clearValidate();
      })
    },
    handleDeleteClass(index, row) {
      if(row.classes.length<=1){
        Message({
          showClose: true,
          message: "学生至少在一个班级内",
          type: 'error'
        });
      }else {
        this.user.id = row.userId;
        this.aClass = row.classes;
        this.delClassFormVisible = true;
      }
    },
    handleEditClass(index, row) {
      this.user.id = row.userId;
      this.editClassFormVisible = true;
    },
    editSchoolSubmit() {
      request.post("/addClass", null, {
        classId: this.user.classId,
        studentId: this.user.id,
      }).then(res => {
        this.editClassFormVisible = false;
        this.queryUsers();
      })
    },
    delSchoolSubmit() {
      request.post("/deleteClass", null, {
        classId: this.aClassId,
        studentId: this.user.id,
      }).then(res => {
        this.delClassFormVisible = false;
        this.queryUsers();
      })
    },
    find() {
      this.queryParams.value = this.input;
      this.queryParams.classId = this.user.classId;
      this.queryUsers();
    },
    handleAddParent(index, row) {
      this.queryParent(row.parents[0].parentId);
      console.log(this.parent)
      this.editParentFormVisible = true;
      this.studentId = row.userId;
      this.resetForm();
    },
    // editParentSubmit() {
    //   request.post("/modifyParent",null,{
    //     "studentId":this.studentId,
    //     "parentId":this.parentId
    //   }).then(res=>{
    //     this.queryUsers()
    //     this.editParentFormVisible=false
    //   })
    // },
    registerAccount(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          request.post("/register", this.registerForm).then(res => {
            this.addFormVisible=false;
            this.queryUsers();
            this.register = false;
          });
        } else {
          return false;
        }
      })

    },
  }
}
</script>
