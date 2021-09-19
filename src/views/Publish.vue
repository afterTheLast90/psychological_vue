<template>
  <div>
    <el-table
        :data="publish"
        style="width: 100%">
      <el-table-column
          label="问卷名"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.questionnaireName}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="发布人"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.publisherName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="发布对象"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.strangeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="状态"
          width="180">
        <template #default="scope">
          <span>{{ scope.row.publish.state==0?"已发布":"已截至"}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="提交人数"
          width="300">
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
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "Publish",
  data() {
    return{
      publish:[],
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId:192386930036805
      },
    }
  },
  methods: {
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
    },
    handleDelete(index,row){
      request.post("/delPublish",null,{
        "publishId":row.publish.publishId
      }).then(res=>{
        this.queryPublish()
        console.log("asfdasfdasf")
      })
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
