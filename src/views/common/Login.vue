<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">智慧管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入账号">
            <i class="el-icon-user el-input__icon" size="22" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
            <i class="el-icon-lock el-input__icon" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()" :loading="loading">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Qs from "qs"
import { login } from "../../api/common"
export default {
  name: "login",
  data: function () {
    return {
      param: {
        username: "",
        password: ""
      },
      loading: false,
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    }
  },
  methods: {
    // 登录
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.loading = true
          login(Qs.stringify(this.param)).then((result) => {
            if (result.code == 200) {
              if (result.data.perms.length == 0) {
                this.$message.error("暂无权限")
                this.loading = false
                return false
              }
              localStorage.setItem("spba-username", result.data.username)
              localStorage.setItem("spba-avatar", result.data.avatar)
              localStorage.setItem("spba-token", result.data.token)
              localStorage.setItem("spba-menu", JSON.stringify(result.data.menu))
              localStorage.setItem("spba-perms", JSON.stringify(result.data.perms))
              this.loading = false
              if (result.data.menu[0]["children"].length == 0) {
                this.$router.push("/" + result.data.menu[0]["path"])
              } else {
                this.$router.push(
                  "/" + result.data.menu[0]["children"][0]["path"]
                )
              }
            } else {
              this.$message.error(result.message)
              this.loading = false
            }
          })
        } else {
          this.loading = false
          this.$message.error("请输入账号和密码")
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/image/login.jpg);
  background-size: 100% 100%;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  margin: -170px 0 0 -200px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
}

.ms-title {
  width: 100%;
  line-height: 35px;
  margin-top: 30px;
  margin-bottom: -10px;
  color: #333333;
  text-align: center;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 8px;
}

.ms-content {
  padding: 45px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: -5px;
  letter-spacing: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.login-wrap .el-form-item--small.el-form-item {
  margin-bottom: 28px;
}

>>> .el-input__inner {
  height: 40px;
  font-size: 15px;
}

.el-input--small .el-input__icon {
  font-size: 18px;
  padding-right: 10px;
  line-height: 40px;
}
</style>