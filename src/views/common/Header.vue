<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!-- <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div> -->
    <!-- <div class="header-title">智慧管理系统</div> -->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 实时显示时间 -->
        <div class="real-time">{{dateFormat(newDate)}}</div>
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip
            effect="dark"
            :content="fullscreen ? `取消全屏` : `全屏`"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!-- <div class="btn-bell error-msg">
          <el-tooltip
            effect="dark"
            :content="
              error_count > 0 ? `有${error_count}个待处理bug` : `错误日志`
            "
            placement="bottom"
          >
            <router-link
              :to="error_count > 0 ? '/errorLog?status=0' : '/errorLog'"
            >
              <i class="el-icon-warning-outline"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="error_count > 0"></span>
        </div> -->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/image/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passwordVisible"
      :close-on-click-modal="false"
      width="450px"
      custom-class="style-dialog"
    >
      <change-password
        v-if="passwordVisible == true"
        @on-success="onSuccess"
      ></change-password>
    </el-dialog>
  </div>
</template>
<script>
import changePassword from "./ChangePassword"
import bus from "@/assets/js/bus"
export default {
  components: { changePassword },
  data() {
    return {
      newDate: new Date(),
      collapse: false,
      fullscreen: false,
      passwordVisible: false,
    }
  },
  computed: {
    username() {
      let username = sessionStorage.getItem("username")
      return username
    },
    error_count() {
      let error_count = sessionStorage.getItem("error_count")
      return error_count
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        sessionStorage.removeItem("spba-username")
        sessionStorage.removeItem("spba-avatar")
        sessionStorage.removeItem("spba-token")
        sessionStorage.removeItem("spba-menu")
        sessionStorage.removeItem("spba-perms")
        this.$router.push("/login")
      }
      if (command == "changePassword") {
        this.passwordVisible = true
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      bus.$emit("collapse", this.collapse)
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 修改密码成功回调
    onSuccess() {
      this.passwordVisible = false
      sessionStorage.removeItem("username")
      var that = this
      setTimeout(function () {
        that.$router.push("/login")
      }, 1500)
    },
    // 时间格式化
    dateFormat () {
      var date = new Date()
        var year = date.getFullYear()
        // 在日期格式中，月份是从0开始的
        // 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        let week = date.getDay() // 星期
        let weekArr = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ]
        // 拼接 时间格式处理
        return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds + ' ' + weekArr[week]
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
    // 挂载时间
    let that = this
    this.timer = setInterval(function () {
      that.newDate = new Date().toLocaleString()
    })
  },
  // 销毁时清除计时器
  beforeDestroy: function () {
      if (this.timer) {
        clearInterval(this.timer)
      }
  }
}
</script>
<style lang="scss">
.header {
  position: relative;
  height: 50px;
  font-size: 18px;
}

.header-title {
  float: left;
  position: absolute;
  width: 250x;
  top: 15px;
  left: 50%;
  margin-left: -140px;
  letter-spacing: 4px;
  font-size: 22px;
  text-align: center;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 50px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
}

.real-time {
  margin-right: 23px;
  margin-top: 5px;
  font-size: 18px;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 9px;
  font-size: 22px;
  margin-left: 9px;
}

.btn-fullscreen {
  margin-top: 6px;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-warning-outline {
  color: #333333;
  font-weight: bold;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #242f42;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}

.style-dialog {
  .header {
    line-height: 24px;
  }

  .el-dialog__header {
    padding-top: 18px !important;
  }

  .el-dialog__body {
    padding-top: 10px !important;
  }
}
</style>