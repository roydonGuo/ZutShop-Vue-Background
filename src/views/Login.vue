<template>
  <div class="wrapper">
    <h1 style="margin:100px auto">后 台 管 理 系 统</h1>
    <div class="login-form">
      <div class="login-title"><b>登 录</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item>
          <el-input class="user-input" size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="user-input" size="medium" prefix-icon="el-icon-lock" show-password
            v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="primary" autocomplete="off" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          this.request.post("/user/login", this.user).then(res => {
            if (res.code === 200) {
              // 存储用户信息到浏览器
              localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo))
              localStorage.setItem("_t", res.data.token);
              this.$router.push("/")
              this.$message.success("登录成功")
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  overflow: hidden;
}

.login-form {
  margin: 100px auto;
  background-color: #fff;
  width: 380px;
  height: 280px;
  padding: 20px;
  border-radius: 10px
}

.login-title {
  margin: 10px auto;
  text-align: center;
  font-size: 20px
}

.user-input {

  margin: 10px 0
}
</style>
