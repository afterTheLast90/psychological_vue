<template>
  <div>
    <div>
      <el-form label-position="left" style="width: 80%" v-model="questionnaire" status-icon class="questionnaire"
               ref="questionnaire" label-width="90px">
        <el-form-item align="left" label="问卷名称" prop="questionnarieName">
          <el-input v-model="questionnaire.questionnaireName" :label-width="formLabelWidth"></el-input>
        </el-form-item>
        <el-form-item align="left" label="问卷简介" prop="questionnaireIntroduction">
          <el-input input type="textarea" v-model="questionnaire.questionnaireIntroduction"
                    :label-width="formLabelWidth"></el-input>
        </el-form-item>
        <el-form-item align="left" label="计算方式">
          <el-select v-model="questionnaire.calculation" placeholder="请选择" @change="changeCalculation">
            <el-option label="因子" :value="0"></el-option>
            <el-option label="总分" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item align="left" label="因子个数" v-if="questionnaire.calculation===0">
          <el-input-number v-model="factorNum" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item align="left" label="模板">
          <el-button @click="addTemplateOptions">添加选项</el-button>
          <el-table
              :data="questionnaire.topicTemplate"
              style="width: 80%">
            <el-table-column
                label="ID"
                width="50">
              <template #default="scope">
                <span>{{ scope.row.optionName }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="选项内容"
                width="180">
              <template #default="scope">
                <el-input v-model="scope.row.optionContent" placeholder="请输入内容">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
                label="分值"
                width="190">
              <template #default="scope">
                <el-input-number v-model="scope.row.optionPoints" :min="1" :max="10" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
                align="right">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="danger"
                    @click="delTemplateOptions(scope.$index)">删除选项
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <span>题目</span>
    <el-divider></el-divider>
    <div>
      <div>
        <el-form label-position="left" style="width: 80%" v-for="(item,index) in questionnaireForm" :key="index"
                 status-icon class="questionnaireForm"
                 ref="questionnaireForm" label-width="90px">
          <el-form-item align="left" label="题号">
            <span>{{ item.titleId }}</span>
          </el-form-item>
          <el-form-item align="left" label="题目">
            <el-input input type="textarea" v-model="item.question" :label-width="formLabelWidth"></el-input>
          </el-form-item>
          <el-form-item align="left" label="选项类型" prop="resource">
            <el-radio-group v-model="item.chooseType">
              <el-radio :label="0">单选</el-radio>
              <el-radio :label="1">多选</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item align="left" label="填写对象" prop="resource">
            <el-radio-group v-model="item.chosePeople">
              <el-radio :label="0">学生</el-radio>
              <el-radio :label="1">家长</el-radio>
              <el-radio :label="2">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item align="left" label="因子" prop="resource" v-if="questionnaire.calculation===0">
            <el-select v-model="item.factorGroupId" placeholder="请选择因子">
              <el-option
                  v-for="factor in factors"
                  :key="factor.value"
                  :label="factor.label"
                  :value="factor.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="left" label="选项">
            <el-button @click="addOptions(item)">添加选项</el-button>
            <el-button @click="negate(item)">反向取分</el-button>
            <el-table
                :data="item.answerOptions"
                style="width: 80%">
              <el-table-column
                  label="ID"
                  width="50">
                <template #default="scope">
                  <span>{{ scope.row.optionName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                  label="选项内容"
                  width="180">
                <template #default="scope">
                  <el-input v-model="scope.row.optionContent" placeholder="请输入内容">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                  label="分值"
                  width="190">
                <template #default="scope">
                  <el-input-number v-model="scope.row.optionPoints" :min="1" :max="10" label="描述文字"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                  align="right">
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="danger"
                      @click="delOptions(scope.$index, scope.row,item)">删除选项
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-button type="danger" @click="remove(item)">移除题目</el-button>
        </el-form>
      </div>
      <el-button @click="addTemplate">添加题目</el-button>
    </div>
    <div v-if="this.questionnaire.calculation === 0">
      <span>变量</span>
      <el-divider></el-divider>
      <div>
        <el-form label-position="left" style="width: 80%" v-for="(item,index) in questionnaire.variables" :key="index"
                 status-icon class="questionnaireForm"
                 :ref="questionnaireForm" label-width="90px">
          <el-form-item align="left" label="变量序号">
            <span>{{ '变量' + item.id }}</span>
          </el-form-item>
          <el-form-item align="left" label="变量名称">
            <el-input v-model="item.name" :label-width="formLabelWidth"></el-input>
          </el-form-item>
          <el-form-item align="left" label="变量简介">
            <el-input input type="textarea" v-model="item.introduction" :label-width="formLabelWidth"></el-input>
          </el-form-item>
          <el-form-item align="left" label="计算方式">
            <el-select v-model="item.type" placeholder="请选择" @change="factorChange(item.factor)">
              <el-option label="求和" :value="0"></el-option>
              <el-option label="求平均" :value="1"></el-option>
              <el-option label="求个数" :value="2"></el-option>
              <el-option label="常量" :value="3"></el-option>
              <el-option label="表达式" :value="4" v-if="item.id!==1"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item align="left" label="因子" v-if="item.type!==4&&item.type!==3">
            <el-select v-model="item.factor" placeholder="请选择因子" @change="factorChange(item.factor)">
              <el-option
                  v-for="factor in factors"
                  :key="factor.value"
                  :label="factor.label"
                  :value="factor.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="left" label="常量" v-if="item.type===3">
            <el-input-number v-model="item.constant" :min="1" :max="100" label="常量"></el-input-number>
          </el-form-item>
          <el-form-item align="left" label="选项" v-if="item.type===2">
            <el-select v-model="item.option" placeholder="请选择选项">
              <el-option
                  v-for="opt in opts"
                  :key="opt.label"
                  :label="opt.label"
                  :value="opt.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="left" label="选择范围" v-if="item.type===4">
            <el-select v-modele="item.operation1" placeholder="请选择变量">
              <el-option
                  v-for="variable in questionnaire.variables"
                  :key="variable.id"
                  :label="variable.name?variable.name:'变量'+variable.id"
                  :value="variable.id"
                  v-if="variable.id<item.id">
              </el-option>
            </el-select>
            <el-select v-model="item.operation" placeholder="请选择运算方式">
              <el-option key="+" value="+"></el-option>
              <el-option key="-" value="-"></el-option>
              <el-option key="*" value="*"></el-option>
              <el-option key="/" value="/"></el-option>
            </el-select>
            <el-select v-model="item.operation2" placeholder="请选择变量">
              <el-option
                  v-for="variable in questionnaire.variables"
                  :key="variable.id"
                  :label="variable.name?variable.name:'变量'+variable.id"
                  :value="variable.id"
                  v-if="variable.id<item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="danger" @click="removeVariable(item)">移除变量</el-button>
        </el-form>
        <el-button @click="addVariable">添加变量</el-button>
      </div>
    </div>
    <span>结果</span>
    <el-divider></el-divider>
    <div>
      <el-form label-position="left" style="width: 80%" v-for="(item,index) in questionnaire.results" :key="index"
               status-icon class="questionnaireForm"
               ref="questionnaireForm" label-width="90px">
        <el-form-item align="left" label="结果序号">
          <span>{{ '结果' + item.id }}</span>
        </el-form-item>
        <el-form-item align="left" label="结果名称">
          <el-input v-model="item.name" :label-width="formLabelWidth"></el-input>
        </el-form-item>
        <el-form-item align="left" label="结果介绍">
          <el-input input type="textarea" v-model="item.introduction" :label-width="formLabelWidth"></el-input>
        </el-form-item>
        <el-form-item v-for="(condition,index2) in item.conditions" :key="index2" align="left" label="条件列表">
          <span>{{ '条件' + (index2 + 1) }}</span>
          <el-select v-model="condition.variable" placeholder="请选择变量">
            <el-option
                v-for="variable in questionnaire.variables"
                :key="variable.id"
                :label="variable.name?variable.name:'变量'+variable.id"
                :value="variable.id">
            </el-option>
          </el-select>
          <el-select v-model="condition.type" placeholder="请选择运算方式">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-input-number v-model="condition.value" :min="1" :max="100" label="值"></el-input-number>
          <el-button type="danger" @click="removeCondition(item,condition)">移除条件</el-button>
        </el-form-item>
        <el-button @click="addCondition(item)">添加条件</el-button>
        <el-button type="danger" @click="removeResult(item)">移除结果</el-button>
      </el-form>
      <el-button @click="addResult">添加结果</el-button>
    </div>
    <el-button style="float:right" @click="questionnaireSubmit">提交</el-button>
  </div>
</template>

<script>
import request from "../utils/request";
import {Message} from "element-ui";

export default {
  data() {
    return {
      questionnaireRule: {},
      options: [{
        value: 0,
        label: '='
      }, {
        value: 1,
        label: '>'
      }, {
        value: 2,
        label: '<'
      }, {
        value: 3,
        label: '>='
      }, {
        value: 4,
        label: '<='
      }],
      factorNum: 0,
      opt: 0,
      opts: [],
      factors: [],
      id: null,
      formLabelWidth: "20px",
      questionnaireForm: [],
      questionnaire: {
        questionnaireId: null,
        questionnaireName: null,
        questionnaireIntroduction: null,
        variables: [],
        calculation: null,
        results: [],
        questionnaireState: null,
        publisherId: null,
        creator: null,
        submissionNumber: null,
        topicTemplate: [],
      }
    }
  },
  watch: {
    factorNum(val, oldVal) {
      this.factors = []

      for (let i = 1; i <= val; i++) {
        this.factors.push({value: i, label: "因子" + i})
      }
    },
    opt(val, oldVal) {
      this.opts = []
      for (let i = 0; i <= val; i++) {
        this.opts.push({value: String.fromCharCode(i + 64), label: String.fromCharCode(i + 65)})
      }
      console.log(this.opts)
    }
  },
  methods: {
    changeCalculation() {
      if (this.questionnaire.calculation === 1) {
        this.questionnaireForm.forEach(function (s) {
          s.factorGroupId = 0;
        })
        this.questionnaire.variables = [
          {
            id: 1,
            name: "总分",
            introduction: "总分",
            type: 0,
            factor: 0
          }
        ]
      }
      console.log(this.questionnaireForm)
    },
    addTemplate() {
      if (!this.questionnaire.topicTemplate) {
        Message({
          showClose: true,
          message: "请先设置模板选项",
        });
        return;
      }
      if (!this.questionnaireForm) {
        this.questionnaireForm = []
      }
      this.questionnaireForm.push({
        titleId: this.questionnaireForm.length + 1,
        questionnaireId: this.id,
        factorGroupId: 1,
        answerOptions: [],
        chooseType: 0,
        chosePeople: 0,
      });
      this.questionnaireForm[this.questionnaireForm.length - 1].answerOptions = [].concat(JSON.parse(JSON.stringify(this.questionnaire.topicTemplate)))
    },
    addTemplateOptions() {
      if (!this.questionnaire.topicTemplate) {
        this.questionnaire.topicTemplate = []
      }
      this.questionnaire.topicTemplate.push({
        optionName: String.fromCharCode(this.questionnaire.topicTemplate.length + 65),
        optionPoints: 0,
        optionContent: ""
      })
    },
    delTemplateOptions(index) {
      this.questionnaire.topicTemplate.splice(index, 1)
      this.questionnaire.topicTemplate.forEach(function (s, num) {
        s.optionName = String.fromCharCode(num + 65)
      })
    },
    delOptions(index, row, item) {
      item.answerOptions.splice(index, 1)
      item.answerOptions.forEach(function (s, num) {
        s.optionName = String.fromCharCode(num + 65)
      })
    },
    addOptions(item) {
      if (!item.answerOptions) {
        item.answerOptions = []
      }
      item.answerOptions.push({
        optionName: String.fromCharCode(item.answerOptions.length + 65),
        optionPoints: 0,
        optionContent: ""
      })
    },
    remove(item) {
      let index = this.questionnaireForm.indexOf(item)
      if (index !== -1) {
        this.questionnaireForm.splice(index, 1)
      }
      this.questionnaireForm.forEach(function (s, num) {
        s.titleId = num + 1
      })
    },
    negate(item) {
      item.answerOptions.forEach(function (s) {
        s.optionPoints = item.answerOptions.length + 1 - s.optionPoints
      })
    },
    addVariable() {
      if (!this.questionnaire.variables) {
        this.questionnaire.variables = []
      }
      this.questionnaire.variables.push({
        id: this.questionnaire.variables.length + 1,
        name: "",
        introduction: "",
        type: 0,
        factor: 1,
        option: "A",
        constant: 1,
        operation1: 1,
        operation: "+",
        operation2: 1
      });
    },
    removeVariable(item) {
      let index = this.questionnaire.variables.indexOf(item)
      if (index !== -1) {
        this.questionnaire.variables.splice(index, 1)
      }
      this.questionnaire.variables.forEach(function (s, num) {
        s.id = num + 1
      })
    },
    factorChange(f) {
      let i = 0;
      this.questionnaireForm.forEach(function (s, num) {
        if (f === 0) {
          s.answerOptions.forEach(function (a, num) {
            i = num;
          })
        } else if (s.factorGroupId === f) {
          s.answerOptions.forEach(function (a, num) {
            i = num;
          })
        }
      })
      this.opt = i
    },
    // ****************************************************************************结果
    addResult() {
      if (!this.questionnaire.results) {
        this.questionnaire.results = []
      }
      this.questionnaire.results.push({
        id: this.questionnaire.results.length + 1,
        name: "",
        introduction: "",
        conditions: []
      });
    },
    addCondition(item) {
      if (!item.conditions) {
        item.conditions = []
      }
      item.conditions.push({
        id: item.conditions.length + 1,
        variable: '',
        type: 0,
        value: 0
      });
    },
    removeResult(item) {
      let index = this.questionnaire.results.indexOf(item)
      if (index !== -1) {
        this.questionnaire.results.splice(index, 1)
      }
      this.questionnaire.results.forEach(function (s, num) {
        s.id = num + 1
      })
    },
    removeCondition(item, condition) {
      let index = item.conditions.indexOf(condition)
      if (index !== -1) {
        item.conditions.splice(index, 1)
      }
      item.conditions.forEach(function (s, num) {
        s.id = num + 1
      })
    },
    questionnaireSubmit() {
      let arr = document.querySelectorAll('input')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
          this.$message("请检查");
          return;
        }
      }
      arr = document.querySelectorAll('textarea')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === '') {
          this.$message("请检查");
          return;
        }
      }

      if (this.questionnaire.calculation === 1) {
        this.questionnaireForm.forEach(function (s) {
          s.factorGroupId = 0;
        })
      }
      request.post("/modifyQuestionnaire", this.questionnaire).then(res => {
      }).then(res => {
        request.post("/modifyDetails", this.questionnaireForm).then(res => {
        }).then(res => {
          this.$router.push({name: 'questionnaire'})
        })
      })
    }
  },
  mounted() {
    let that = this;
    this.id = this.$route.params.id
    request.get("/questions", {"id": this.id}).then(res => {
      this.questionnaireForm = res.data;
      this.questionnaireForm.forEach(function (s, num) {
        if (that.factorNum < s.factorGroupId) {
          that.factorNum = s.factorGroupId;
        }
      })
    })
    request.get("/question", {"id": this.id}).then(res => {
      this.questionnaire = res.data;
    })
  }
}
</script>



