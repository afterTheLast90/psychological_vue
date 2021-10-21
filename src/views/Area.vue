<template>
  <div>
    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="2">
        <h2>地区管理</h2>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0px" :span="22">
        <el-button plain style="float: right;" @click="addArea">添加地区</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-left: 0px; margin-right: 0px">
      <el-col style="padding-left: 0px; padding-right: 0px" :span="3">
        <el-select v-model="queryParams.cityId" placeholder="请选择市">
          <el-option
              v-for="item in cities"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId">
          </el-option>
        </el-select>
      </el-col>
      <el-col style="padding-left: 0px; padding-right: 0;" :span="3">
        <el-select v-model="queryParams.provinceId" style=";margin-left: 10px" placeholder="请选择省">
          <el-option
              v-for="item in provinces"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :offset="1" style="padding-left:0px; padding-right: 0px" :span="17">
        <el-input id="findText" v-model="queryParams.value" placeholder="输入关键字搜索">
          <template slot="append">
            <el-button type="primary" icon="el-icon-search" plain @click="find"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
        :data="areas"
        style="width: 100%">
      <el-table-column
          label="地区"
          width="180">
        <template #default="scope">
          <i class="el-icon-user-solid"></i>
          <span style="margin-left: 10px">{{ scope.row.areaName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="市"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="省"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="负责人"
          width="180">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="学校"
          width="180">
        <template #default="scope">
          <el-tag v-for="item in scope.row.school" :key="item.schoolId">{{ item.schoolName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="addSchool(scope.$index, scope.row)">添加学校
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleEdit(scope.$index, scope.row)">编辑地区
          </el-button>
          <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.state===1"
              @click="delSchool(scope.$index, scope.row)">删除学校
          </el-button>
          <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.state===1"
              @click="handleDelete(scope.$index, scope.row)">删除地区
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
      <el-dialog :close-on-click-modal="false" width="35%" title="添加/编辑地区" :visible.sync="addFormVisible">
        <el-form :model="area">
          <el-form-item label="地区" :label-width="formLabelWidth">
            <el-cascader
                placeholder="请选择地区"
                class="widthSmall"
                size="large"
                :options="options"
                v-model="selectedOptions"
                @change="addressChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="负责人" :label-width="formLabelWidth">
            <el-select v-model="principal" placeholder="请选择负责人">
              <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAreaSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="修改负责人" :visible.sync="editFormVisible">
        <el-form :model="area">
          <el-form-item label="负责人" :label-width="formLabelWidth">
            <el-select v-model="principal" placeholder="请选择负责人">
              <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAreaSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="添加学校" :visible.sync="addSchoolFormVisible">
        <el-form :model="school" status-icon :rules="rules" class="school" ref="school">
          <el-form-item label="学校名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="school.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重 置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSchoolSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog :close-on-click-modal="false" width="35%" title="删除学校" :visible.sync="delSchoolFormVisible">
        <el-form>
          <el-form-item label="学校名称" prop="name" :label-width="formLabelWidth">
            <el-select v-model="school.schoolId" >
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
          <el-button type="primary" @click="delSchoolSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import request from "../utils/request";
import {CodeToText, regionData} from "element-china-area-data";

export default {

  data() {
    let validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('学校名不能为空'))
      }
      callback();
    };
    return {
      users: [],
      areas: [],
      cities: [],
      provinces: [],
      schools:[],
      principal: null,
      fromLabelWidth: '80px',
      addFormVisible: false,
      editFormVisible: false,
      delSchoolFormVisible: false,
      addSchoolFormVisible: false,
      school: {
        schoolId: null,
        name: "",
        areaId: null,
      },
      rules: {
        name: [
          {validator: validateName, trigger: 'blur'}
        ]
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: "",
        cityId: "",
        provinceId: "",
      },
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      area: {
        areaId: null,
        areaName: "",
        cityId: "",
        cityName: "",
        provinceId: "",
        provinceName: "",
        principal: null
      },
      formLabelWidth: "80px",
      form: {
        provinceCode: null,
        cityCode: null,
        areaCode: null
      },
      options: regionData, //省市区数据
      selectedOptions: [], // 选中的地区
    }
  },
  mounted() {
    this.queryArea();
    this.queryCity();
    this.queryProvinces();
  },
  created() {
    // 初始化省市区
    this.selectedOptions = [this.form.provinceCode, this.form.cityCode, this.form.areaCode];
  },
  methods: {
    //查询Area表
    queryArea() {
      request.get("/areas", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageSize = data.pageSize;
        this.page.pageNum = data.pageNum;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.areas = data.data;
      })
    },
    queryUsers() {
      request.get("/psychological").then(res => {
        this.users = res.data.data;
      })
    },
    queryCity() {
      request.get("/city").then(res => {
        this.cities = res.data;
      })
    },
    queryProvinces() {
      request.get("/province").then(res => {
        this.provinces = res.data;
      })
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryArea();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryArea();
    },
    find() {
      console.log(this.queryParams)
      this.queryArea();
    },
    handleDelete(index, row) {
      request.post("/deleteArea/" + row.areaId).then(res => {
        this.queryArea();
      })
    },
    addArea() {
      this.addFormVisible = true;
      this.principal = null;
      this.queryUsers();
    },
    addAreaSubmit() {
      this.area.areaId = this.form.areaCode;
      this.area.areaName = CodeToText[this.form.areaCode];
      this.area.cityId = this.form.cityCode;
      this.area.cityName = CodeToText[this.form.cityCode];
      this.area.provinceId = this.form.provinceCode;
      this.area.provinceName = CodeToText[this.form.provinceCode];
      this.area.principal = this.principal;
      request.post("/addArea", this.area).then(res => {
        this.addFormVisible = false;
        this.queryArea();
      })
    },
    addressChange(arr) {
      this.form.provinceCode = arr[0];
      this.form.cityCode = arr[1];
      this.form.areaCode = arr[2];
    },
    handleEdit(index, row) {
      this.form.areaCode = row.areaId;
      this.principal = row.areaPrincipal;
      this.editFormVisible = true;
      this.queryUsers();
    },
    editAreaSubmit() {
      request.post("/editPrincipal", null, {
        areaId: this.form.areaCode,
        areaPrincipal: this.principal,
      }).then(res => {
        this.editFormVisible = false;
        this.queryArea();
      })
    },
    addSchoolSubmit() {
      this.$refs["school"].validate((valid) => {
        if (valid) {
          request.post("/addSchool", null, {
            areaId: this.school.areaId,
            schoolName: this.school.name,
          }).then(res => {
            this.queryArea();
            this.addSchoolFormVisible = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addSchool(index, row) {
      this.school.name = "";
      this.school.areaId = row.areaId;
      this.addSchoolFormVisible = true;
    },
    delSchool(index, row) {
      this.schools=row.school;
      this.delSchoolFormVisible = true;
    },
    delSchoolSubmit() {
          request.post("/delSchool", null, {
            schoolId: this.school.schoolId,
          }).then(res => {
            this.queryArea();
            this.delSchoolFormVisible = false;
          })
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["school"].clearValidate();
      })

    }
  }
}
</script>
