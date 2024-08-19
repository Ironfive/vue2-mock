<template>
  <div>
    <h1>首页</h1>
<!--    <el-button type="primary" @click="roterTo('/cityOption')">跳转至城市定位</el-button>-->
      <div class="fixedNavigator" @click="showForm">测算</div>
      <main-form :visible.sync="formShow"></main-form>
  </div>
</template>

<script>
import MainForm from '@/pages/home/components/mainForm.vue'
export default {
  name:'Home',
  components:{
    MainForm
  },
  data () {
    return {
      formShow:false,
    }
  },
  created() {

  },
  methods: {
    showForm(){
      this.formShow = !this.formShow;
    },
    roterTo(path){
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss" scoped>
.fixedNavigator{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 200px;
  background-color: #1890ff;
}
</style>

