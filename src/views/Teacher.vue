<template>
  <div>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="2">
        <h2>教师管理</h2>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="22">
        <el-button plain style="float: right;" @click="addTeacher">添加教师</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-select v-model="user.school_id" placeholder="请选择学校">
          <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
          </el-option>
        </el-select>
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
        :data="users"
        style="width: 100%">
      <el-table-column
          label="用户名"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="性别"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.userGender === 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="账号"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.userAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="年龄"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="学校"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.school.schoolName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="手机号"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.userPhoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="手机验证"
          width="180">
        <template #default="scope">
          <el-tag :type="scope.row.phoneNumberChecked===1?'success':'warning'" effect="dark">
            {{ scope.row.phoneNumberChecked === 1 ? "已验证" : "未验证" }}
          </el-tag>
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
      <el-dialog width="35%" title="添加教师" :visible.sync="addFormVisible">

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
          <el-form-item label="确认密码" prop="check_password" :label-width="formLabelWidth">
            <el-input type="password" v-model="user.check_password" autocomplete="off" show-password></el-input>
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
          <el-form-item label="手机号" prop="phone_number" :label-width="formLabelWidth">
            <el-input v-model="user.phone_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学校" prop="school_id" :label-width="formLabelWidth">
            <el-select v-model="user.school_id" placeholder="请选择学校">
              <el-option
                  v-for="item in schools"
                  :key="item.schoolId"
                  :label="item.schoolName"
                  :value="item.schoolId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTeacherSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog width="35%" title="编辑教师" :visible.sync="editFormVisible">

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
          <el-form-item label="手机号" prop="phone_number" :label-width="formLabelWidth">
            <el-input v-model="user.phone_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学校" prop="school_id" :label-width="formLabelWidth">
            <el-select v-model="user.school_id" placeholder="请选择学校">
              <el-option
                  v-for="item in schools"
                  :key="item.schoolId"
                  :label="item.schoolName"
                  :value="item.schoolId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editTeacherSubmit">提 交</el-button>
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
        callback(new Error('用户名不能为空'))
      }
      callback();
    };
    let validateSchoolId = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('学校不能为空'))
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
      userId:192386930036805,
      input:"",
      users: [],
      schools: [],
      formLabelWidth: "80px",
      addFormVisible: false,
      editFormVisible: false,
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: "",
        schoolId: ""
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
        school_id: null
      },
      rules: {
        name: [
          {validator: validateName, trigger: 'blur'}
        ],
        school_id: [
          {validator: validateSchoolId, trigger: 'blur'}
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
    this.querySchool();
  },
  methods: {
    queryUsers() {
      request.get("/getTeacherList", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.users = data.data;
      })
    },
    querySchool() {
      request.get("/selectSchool").then(res => {
        this.schools = res.data;
      })
    },
    addTeacher() {
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
    addTeacherSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          this.addFormVisible = false;
          request.post("/addTeacher", {
            "userId": 111,
            "userAccount": this.user.account,
            "userBirthday": this.user.birthday,
            "userGender": this.user.gender === "男" ? 1 : 0,
            "userName": this.user.name,
            "userPassword": this.user.password,
            "userPhoneNumber": this.user.phone_number
          }, {
            schoolId: this.user.school_id,
          }).then(res => {
            this.queryUsers();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["user"].clearValidate();
      })

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
      this.user.school_id=row.school.schoolId;
      this.resetForm();
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryUsers();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryUsers();
    },
    editTeacherSubmit() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          this.addFormVisible = false;
          request.post("/modifyTeacher", {
            "userId":this.user.id,
            "userAccount": this.user.account,
            "userBirthday": this.user.birthday,
            "userGender": this.user.gender==="男"?1:0,
            "userName": this.user.name,
            "userPassword": this.user.password,
            "userPhoneNumber": this.user.phone_number
          },{
            schoolId:this.user.school_id,
          }).then(res=>{
            this.queryUsers();
            this.editFormVisible=false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleDelete(index, row) {
      request.post("/deleteUser/" + row.userId).then(res => {

      }).then(res=>{
        this.queryUsers();
      });
    },
    find() {
      this.queryParams.value = this.input;
      this.queryParams.schoolId = this.user.school_id;
      this.queryUsers();
    }
  }
}
</script>
