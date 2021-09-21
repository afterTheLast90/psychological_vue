<template>
  <div>

    <el-dialog title="注册账号" :visible.sync="register" width="85%" top="15px">
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
        <el-button @click="register = false">取 消</el-button>
        <el-button type="primary" @click="registerAccount('registerForm')">确 定</el-button>
      </div>
    </el-dialog>

<!--    <el-dialog width="100%" title="加入班级" :visible.sync="editClassFormVisible">-->
<!--      <el-form>-->
<!--        <el-form-item label="班级" prop="name" :label-width="formLabelWidth">-->
<!--          <el-cascader-->
<!--              v-model="selectedOptions"-->
<!--              :options="options"-->
<!--              @change="handleChange"></el-cascader>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="addFormVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="editSchoolSubmit">提 交</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

    <el-form style="width: 300px" ref="loginForm" :model="form" :rules="rules" label-width="60px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-button @click="register=true">注册</el-button>
          </el-col>
          <el-col :span="15">
            <el-button type="primary" @click="onSubmit('loginForm')">登录</el-button>
          </el-col>
        </el-row>


      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "Login",
  data() {
    return {
      selectedOptions: [],
      options: [],
      form: {
        username: '',
        password: ''
      },
      register: false,
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
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ]
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
    }
  },
  mounted() {
    this.querySchoolList()
  },
  methods: {

    querySchoolList() {
      request.get("/getSchoolListNoLogin").then(res => {
        console.log(res.data)
        this.options = res.data;
      })
    },
    handleChange(arr) {
      this.registerForm.classId = arr[1];
    },
    registerAccount(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          request.post("/register", this.registerForm).then(res => {
            this.register = false;
          });
        } else {
          return false;
        }
      })

    },
    onSubmit(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post("/login", {
            'account': this.form.username,
            'password': this.form.password
          }).then(res => {
            localStorage.setItem("sa-token", res.data.token)
            localStorage.setItem("userRole", res.data.role)
            this.$router.push("/mobile/beFilledWith");
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
