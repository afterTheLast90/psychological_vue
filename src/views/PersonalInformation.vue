<template>
  <div>
    <el-container>
      <el-header height="30">
        <el-avatar :size="100" :src="circleUrl"></el-avatar>
      </el-header>
      <el-main>
        <el-form label-position="left">
          <el-form-item label="姓名" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.users.userName }}
            </span>
          </el-form-item>
          <el-form-item v-if="user.users.userRole!=3" label="账号" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.users.userAccount }}
            </span>
          </el-form-item>
          <el-form-item v-if="user.users.userRole!=2" label="联系方式" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.users.userPhoneNumber }}
            </span>
          </el-form-item>
          <el-form-item v-if="user.users.userRole!=4" label="出生日期" :label-width="formLabelWidth" align="left">
            <span style="width:auto; display:block; text-align:left;">
            {{ user.users.userBirthday }}
            </span>
          </el-form-item>
          <el-form-item label="班级" :label-width="formLabelWidth" align="left" v-if="user.users.userRole==2">
            <span style="width:auto; display:block; text-align:left;">
            <div v-for="(item,index) in user.className" :key="index">
              {{ item }}
            </div>
<!--              <el-button @click="addClass">加入班级</el-button>-->
            </span>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <el-dialog :close-on-click-modal="false" width="100%" title="加入班级" :visible.sync="editClassFormVisible">
      <el-form>
        <el-form-item label="班级" prop="name" :label-width="formLabelWidth">
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSchoolSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  data() {
    return {
      classId: null,
      selectedOptions: [],
      options: [],
      editClassFormVisible: false,
      user: [],
      formLabelWidth: "80px",
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  mounted() {
    this.queryUser();
    this.querySchoolList();
  },
  methods: {
    querySchoolList() {
      request.get("/getSchoolList").then(res => {
        console.log(res.data)
        this.options = res.data;
      })
    },
    queryUser() {
      request.get("/getUser").then(res => {
        this.user = res.data
      })
    },
    addClass() {
      this.editClassFormVisible = true
    },
    handleChange(arr) {
      this.classId = arr[1];
    },
    editSchoolSubmit() {
      request.post("/addClass", null, {
        classId: this.classId,
        studentId: this.user.users.userId,
      }).then(res => {
        this.editClassFormVisible = false;
        this.queryUsers();
        this.querySchoolList();
      })
    },
  }
}
</script>

<style scoped>

</style>
