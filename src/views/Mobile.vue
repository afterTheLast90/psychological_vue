<template>
  <div style="height: 100%;margin: 0px">
    <el-container style="height: 100%;max-width:805px;overflow:hidden">
      <el-header>
        <span style="margin-left: 43px">心理测评</span>
        <!--        <el-button type="info" circle style="float: right;margin-top: 9px;background-color: #B3C0D1;border-color: #B3C0D1">-->

        <el-button type="normal" circle
                   @click="editUser"
                   style="float:right; margin-top:6px;
                   background-color: #B3C0D1;border: 0;
                   font-size: 24px;color: whitesmoke" icon="el-icon-edit" title="修改信息"></el-button>

        <!--        </el-button>-->
      </el-header>
      <el-main style="overflow-y: auto;height: calc(100% - 120px)">
        <router-view></router-view>
      </el-main>
      <el-footer style="padding: 0;height: 56px">
        <el-menu
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true">
          <el-row>
            <el-col :span="7">
              <el-menu-item index="/mobile/personalInformation">个人信息</el-menu-item>
            </el-col>
            <el-col :span="10">
              <el-menu-item index="/mobile/beFilledWith">待填写问卷</el-menu-item>
            </el-col>
            <el-col :span="7">
              <el-menu-item index="/mobile/questionnaireResult">问卷结果</el-menu-item>
            </el-col>
          </el-row>
        </el-menu>
      </el-footer>
    </el-container>


    <el-dialog :close-on-click-modal="false" width="85%" title="编辑学生" :visible.sync="editFormVisible">
      <el-form :model="user" status-icon :rules="rules" class="user" ref="user">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="user.userGender=== 1 ? '男' : '女'" placeholder="男/女" style="width: 100%;">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="user.userAccount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.userPassword" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthday" >
          <el-date-picker
              style="width: 100%;"
              v-model="user.userBirthday"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="resetForm">重 置</el-button>-->
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStudentSubmit">提 交</el-button>
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
      editFormVisible: false,
      user: {
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
      },


    }

  },
  mounted() {
    this.queryUser();
  },
  methods: {
    queryUser() {
      request.get("/getUser").then(res => {
        console.log(res.data.users)
        this.user = res.data.users
      })
    },
    editStudentSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          request.post("/modifyStudent", {
            "userId": this.user.userId,
            "userAccount": this.user.userAccount,
            "userBirthday": this.user.userBirthday,
            "userGender": this.user.gender === "男" ? 1 : 0,
            "userName": this.user.userName,
            "userPassword": this.user.userPassword,
            "userPhoneNumber": 13777777777
          }).then(res => {
            this.editFormVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editUser() {
      this.queryUser();
      this.editFormVisible = true;
    }
  }
}
</script>

<style scoped>

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  /*line-height: 160px;*/
}
</style>
