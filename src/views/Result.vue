<template>
<div>
 {{result.result.introduction}}
</div>
</template>

<script>
import request from "../utils/request";

export default {
  name: "Result",
  data(){
    return{
      userQuestionnaireId:null,
      result:[]
    }

  },
  mounted() {
      this.userQuestionnaireId = this.$route.query.id
    request.get("/getLastResult",{
      "userQuestionnaireId":this.userQuestionnaireId
    }).then(res=>{
      this.result=res.data
    })
  },
  methods:{

  }
}
</script>

<style scoped>

</style>
