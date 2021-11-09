<template>
  <div>
    <el-table
        :data="publish"
        style="width: 100%">
      <el-table-column
          label="问卷名"
          width="120">
        <template #default="scope">
          <span>{{ scope.row.questionnaireName}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="发布人"
          width="120">
        <template #default="scope">
          <span>{{ scope.row.publisherName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="发布对象"
          width="120">
        <template #default="scope">
          <span>{{ scope.row.strangeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="状态"
          width="120">
        <template #default="scope">
          <span>{{ scope.row.publish.state==0> new Date()?"已发布":"已截至"}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="提交人数"
          width="120">
        <template #default="scope">
          <span>{{scope.row.publish.submissionNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="时间"
          width="300">
        <template #default="scope">
          <span>{{scope.row.publish.releaseTime+"~"+scope.row.publish.deadline}}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="exportResult(scope.$index, scope.row)">导出结果
          </el-button>
          <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.state===1"
              @click="handleResult(scope.$index, scope.row)">查看结果
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


    <el-dialog  width="35%" title="结果列表" :visible.sync="editResultFormVisible">

      <el-table
          :data="result"
          style="width: 100%">
        <el-table-column
            label="姓名"
            width="180">
          <template #default="scope">
            <span>{{ scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="结果"
            width="180">
          <template #default="scope">
            <span>{{ scope.row.userQuestionnaire.result.name}}</span>
          </template>
        </el-table-column>

<!--        <el-table-column-->
<!--            align="right">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--                size="mini"-->
<!--                type="primary"-->
<!--                :disabled="scope.row.state===1"-->
<!--                @click="handleResult(scope.$index, scope.row)">查看结果-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <el-pagination
          @size-change="changePageSize2"
          @current-change="changePageNumber2"
          :current-page="page2.pageNum"
          :page-sizes="[1,2,3]"
          :page-size="page2.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page2.total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import request from "../utils/request";
import {Message} from "element-ui";

export default {
  name: "Publish",
  data() {
    return{
      result:[],
      editResultFormVisible:false,
      publish:[],
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      page2: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        publishId:null,
      },
    }
  },
  methods: {
    queryResult() {
      request.get("/getPublishResult",this.queryParams2 ).then(res=>{
        let data = res.data;
        this.page2.pageNum = data.pageNum;
        this.page2.pageSize = data.pageSize;
        this.page2.pages = data.pages;
        this.page2.total = data.total;
        this.result = data.data;
      })
    },
    handleResult(index,row){
      this.editResultFormVisible=true;
      this.queryParams2.publishId=row.publish.publishId;
      console.log(this.queryParams2.publishId)
      this.queryResult();
    },
    queryPublish() {
      request.get("/publish", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.publish = data.data;
      })
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryPublish();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryPublish();
    },changePageSize2(e) {
      this.queryParams.pageSize = e;
      this.queryPublish();
    },
    changePageNumber2(e) {
      this.queryParams.pageNum = e;
      this.queryPublish();
    },
    handleDelete(index,row){
      request.post("/delPublish",null,{
        "publishId":row.publish.publishId
      }).then(res=>{
        this.queryPublish()
      })
    },
    exportResult(index,row){
      // request.download("/export",null)
      if (row.publish.submissionNumber>0){
        request.download("/export",null,{
          "publishId":row.publish.publishId
        }).then(res=>{
          this.queryPublish()
        })
      }else {
        Message({
          showClose: true,
          message: "当前没有人完成问卷",
          type: 'error'
        });
      }
    }
  },
  mounted() {
    this.queryPublish()
    console.log(this.publish)
  }
}
</script>

<style scoped>

</style>
