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
        <el-form-item align="left" label="是否乱序">
          <el-select v-model="questionnaire.orderNo" placeholder="请选择" @change="changeCalculation">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
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
          <el-form-item align="left" label="题号">{{ "题目" + (index + 1) }}
          </el-form-item>
          <el-form-item align="left" label="题目">
            <el-button @click="changeQquestioType(item)">更改题目类型</el-button>
          </el-form-item>
          <el-form-item align="left">
            <el-input v-if="!item.questionType" input type="textarea" v-model="item.question"
                      :label-width="formLabelWidth"></el-input>
            <el-upload
                v-if="item.questionType"
                :limit="1"
                class="upload-demo"
                :action=url
                :file-list="item.question===null||item.question===''?[]:[{name: item.question.substring(21), url:  getUrl(item.question)}]"
                list-type="picture"
                :on-remove="(res,file)=>{handleRemove(item)}"
                :on-success="(res,file)=>{handleAvatarSuccess(item,res,file)}"
                :before-upload="beforeAvatarUpload">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2M</div>
            </el-upload>
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
            <el-button @click="changeOptionType(item.answerOptions)">更改选项类型</el-button>
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
                  <el-input v-model="scope.row.optionContent" placeholder="请输入内容"
                            v-if="!scope.row.optionType"></el-input>
                  <el-upload
                      v-if="scope.row.optionType"
                      :limit="1"
                      class="upload-demo"
                      :action=url
                      :on-remove="(res,file)=>{handleRemoveOption(scope.row)}"
                      :on-success="(res,file)=>{handleAvatarSuccessOption(scope.row,res,file)}"
                      :file-list="scope.row.optionContent===null||scope.row.optionContent===''?[]:[{name: scope.row.optionContent.substring(21), url: getUrl(scope.row.optionContent)}]"
                      :before-upload="beforeAvatarUpload">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2M</div>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column
                  label="分值"
                  width="190">
                <template #default="scope">
                  <el-input-number v-model="scope.row.optionPoints" :min="-item.answerOptions.length"
                                   :max="item.answerOptions.length" label="描述文字"></el-input-number>
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
          <el-button type="primary" @click="insert(item)">插入题目</el-button>
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
      url: request.baseUrl + "/upload/avatar",
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
      },
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
    getUrl(url) {
      return request.baseUrl + url;
    },
    changeQquestioType(item) {
      item.questionType = !item.questionType;
      item.question = "";
    },
    handleRemove(item) {
      item.question = ""
    },
    handleRemoveOption(row) {
      row.optionContent = ""
    },
    handleAvatarSuccess(item, res, file) {
      item.question = res.data
    },
    handleAvatarSuccessOption(row, res, file) {
      row.optionContent = res.data
    },
    changeOptionType(answerOptions) {
      let type = answerOptions[0].optionType;
      answerOptions.forEach(function (s) {
        s.optionContent = ""
        s.optionType = !type;
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
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
        questionType: false
      });
      this.questionnaireForm[this.questionnaireForm.length - 1].answerOptions = [].concat(JSON.parse(JSON.stringify(this.questionnaire.topicTemplate)))
    },
    addTemplateOptions() {
      if (!this.questionnaire.topicTemplate) {
        this.questionnaire.topicTemplate = []
      }
      this.questionnaire.topicTemplate.push({
        optionName: String.fromCharCode(this.questionnaire.topicTemplate.length + 65),
        optionPoints: this.questionnaire.topicTemplate.length +1,
        optionContent: "",
        optionType: false
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
        optionPoints: item.answerOptions.length+1,
        optionContent: "",
        optionType: item.answerOptions[0].optionType
      })
    },
    insert(item) {
      let index = this.questionnaireForm.indexOf(item)
      if (index !== -1) {
        this.questionnaireForm.splice(index, 0,
            {
              titleId: this.questionnaireForm.length + 1,
              questionnaireId: this.id,
              factorGroupId: 1,
              answerOptions: [],
              chooseType: 0,
              chosePeople: 0,
              questionType: false
            })
        this.questionnaireForm[index].answerOptions = [].concat(JSON.parse(JSON.stringify(this.questionnaire.topicTemplate)))

      }
      this.questionnaireForm.forEach(function (s, num) {
        s.titleId = num + 1
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

      let arr = [];
      for(let i = 0 ;i<item.answerOptions.length;i++){
        arr.push(item.answerOptions[i].optionPoints);
      }
      for(let i = 0 ;i<item.answerOptions.length;i++){
        item.answerOptions[i].optionPoints=
            arr[item.answerOptions.length-1-i];
      }
      // item.answerOptions.forEach(function (s) {
      //   s.optionPoints = s.optionPoints % item.answerOptions.length + 1
      // })
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
      let that = this;
      let flag = false;
      let resultFlag = false;
      this.questionnaireForm.forEach(function (s) {
        if (s.question === "" || s.question === null) {
          flag = true
        }
        s.answerOptions.forEach(function (b) {
          if (b.optionContent === "" || b.optionContent === null) {
            flag = true
          }
        })
      });
      this.questionnaire.variables.forEach(function (b) {
        if (b.name === "" || b.name === null) {
          flag = true;
        }
        if (b.introduction === "" || b.introduction === null) {
          flag = true;
        }
      })
      if (flag) {
        Message({
          showClose: true,
          message: "不能有空值请检查",
          type: 'error'
        });
        return;
      }
      if (this.questionnaire.calculation === 1) {
        this.questionnaireForm.forEach(function (s) {
          s.factorGroupId = 0;
        })
      }

      if (this.questionnaireForm.length == 0) {
        Message({
          showClose: true,
          message: "题目不能为空",
          type: 'error'
        });
        return;
      }
      if (this.questionnaire.variables == null) {
        Message({
          showClose: true,
          message: "变量不能为空",
          type: 'error'
        });
        return;
      }
      if (this.questionnaire.results == null) {
        Message({
          showClose: true,
          message: "结果不能为空",
          type: 'error'
        });
        return;
      }
      console.log(this.questionnaire.results)
      if (this.questionnaire.results.forEach(function (s,indexs) {
        if (s.conditions.length == 0) {
          resultFlag = true;
        }
        if (s.name===""||s.introduction===""||s.name===null||s.introduction==null){
          Message({
            showClose: true,
            message: "结果" + (indexs + 1) + "不完整",
            type: 'error'
          });
          throw onerror;
        }
        s.conditions.forEach(function (b, index) {
          if (b.variable == null||b.variable=="") {
            Message({
              showClose: true,
              message:  "结果" + (indexs + 1) +"条件" + (index + 1) + "不完整",
              type: 'error'
            });
            throw onerror;
          }
        })
      })) ;
      if (!resultFlag) {
        that.$message("必须有一个没有条件的默认结果");
        return;
      }
      request.post("/modifyQuestionnaire", this.questionnaire).then(res => {
        request.post("/modifyDetails", this.questionnaireForm).then(res => {
        }).then(res => {
          this.$router.push({name: 'questionnaire'})
        })
      }).catch(res => {
        Message({
          showClose: true,
          message: "变量和结果不能为空",
          type: 'error'
        });
      })
    }
  },
  mounted() {
    let that = this;
    this.id = this.$route.query.id
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



