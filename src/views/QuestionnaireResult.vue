<template>
  <div>

    <el-table
        :data="userQuestionnaire"
        style="width: 100%;padding: 0"
        :show-header="false">
      <el-table-column style="padding: 0">
        <template #default="scope">
          <el-collapse>
            <el-collapse-item :title="scope.row.questionnaireName">
              <div>发布人：{{ scope.row.publisherName }}</div>
              <div>完成时间：{{ scope.row.userQuestionnaire.updateTime }}</div>
              <router-link :to="{name:'result',params: {id: scope.row.userQuestionnaire.userQuestionnaireId}}">
                <el-button>查看结果</el-button>
              </router-link>
            </el-collapse-item>
          </el-collapse>
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
  data() {
    return {
      userQuestionnaire: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: 200878379860037,
      },
      page: {
        pageSize: 0,
        pageNum: 0,
        total: 0,
        pages: 0
      },
    }
  },
  methods: {
    queryResult() {
      request.get("/getResult", this.queryParams).then(res => {
        let data = res.data;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        this.page.pages = data.pages;
        this.page.total = data.total;
        this.userQuestionnaire = data.data;
      })
    },
    changePageSize(e) {
      this.queryParams.pageSize = e;
      this.queryResult();
    },
    changePageNumber(e) {
      this.queryParams.pageNum = e;
      this.queryResult();
    },
  },
  mounted() {
    this.queryResult()
    console.log(this.userQuestionnaire)
  }
}

</script>

<style scoped>

</style>
