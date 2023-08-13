<template>
  <el-card class="box-card">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-form
            label-position="left"
            label-width="80px"
            :model="formLogin"
            ref="formLogin">
          <!-- $refs 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 $refs 。 -->
          <el-form-item label="账号" prop="name">
            <el-input v-model="formLogin.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formLogin.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="testLogin">登录</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="" @click="toRegister">没有账号，立即注册<i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {login, register} from "@/api/login";

export default {
  name: 'login',
  data() {
    return {
      formLogin: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    // 向登录接口发起请求
    testLogin() {
      login(this.formLogin).then(res => {
        console.log(res, 1111)
      })
    },
    toRegister() {
      register(this.formLogin).then(res => {
        console.log(res, 1111)
      })
    },
    // 表单重置
    resetForm() {
      console.log('session')
      this.$refs['formLogin'].resetFields();
    }
  }
}
</script>