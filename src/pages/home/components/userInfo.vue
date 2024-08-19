<template>
  <div>
    <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        top="50%" :modal="true"
        title="个人信息"
        :visible.sync="dialogFormVisible"
        width="40%">
      <div class="customForm">
        <el-form size="mini" :model="userMessages" :rules="rules">
          <el-card>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="企业名称" label-position="top" prop="companyName">
                  <el-input class="fill-width" v-model="userMessages.area"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" label-position="top"  prop="contractName">
                  <el-input class="fill-width" v-model="userMessages.contractName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="联系电话" label-position="top" required prop="contractPhone">
                  <el-input class="fill-width" v-model="userMessages.contractPhone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验证码" label-position="top" required prop="verifyCode">
                  <el-input class="fill-width" v-model="userMessages.verifyCode">
                    <el-button slot="append" size="mini" type="primary" @click="getVerifyCode" :disabled="disabled">{{setCode}}</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "userInfo",
  props:{
    visible:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    dialogFormVisible:{
      get(){
        return this.visible
      },
      set(val){
        this.$emit('update:visible',val)
      }
    }
  },
  data(){
    return{
      setCode:'获取验证码',
      userMessages:{},
      rules:{},
      disabled:false
    }
  },
  methods:{
    validateBtn(){
      //倒计时
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.disabled = false;
          this.setCode = "发送验证码";
        } else {
          this.setCode = time + "秒后重试";
          this.disabled = true;
          time--;
        }
      }, 1000);
    },
    getVerifyCode(){
      this.validateBtn()
      //获取验证码操作
    }
  }
}
</script>

<style scoped>

</style>