<template>
  <div class="index">
    <div class="index-left">
      <div class="index-side-bar-container">
        <div class="index-side-bar" :class="before == -1 ? 'before' : ''">
          <img src="../../assets/image/slogan.png" alt="" />
        </div>
        <template v-for="(item, index) in items">
          <div
            v-if="index == active"
            class="index-side-bar active"
            @click="selectBar(index)"
            :key="index"
          >
            <div class="active-ele"></div>
            <i
              :class="item.icon"
              style="font-size: 20px; margin: 10px 0 1px 0"
            ></i>
            <div>{{ item.name }}</div>
          </div>
          <div
            v-else-if="index == after"
            class="index-side-bar after"
            @click="selectBar(index)"
            :key="index"
          >
            <i
              :class="item.icon"
              style="font-size: 20px; margin: 10px 0 1px 0"
            ></i>
            <div>{{ item.name }}</div>
          </div>
          <div
            v-else-if="index == before"
            class="index-side-bar before"
            @click="selectBar(index)"
            :key="index"
          >
            <i
              :class="item.icon"
              style="font-size: 20px; margin: 10px 0 1px 0"
            ></i>
            <div>{{ item.name }}</div>
          </div>
          <div
            v-else
            class="index-side-bar"
            @click="selectBar(index)"
            :key="index"
          >
            <i
              :class="item.icon"
              style="font-size: 20px; margin: 10px 0 1px 0"
            ></i>
            <div>{{ item.name }}</div>
          </div>
        </template>
        <div
          class="index-side-bar"
          :class="after == parseInt(sideBarNum) ? 'after' : ''"
        ></div>
      </div>
    </div>
    <div class="index-right">
      <div class="index-header">
        <v-head></v-head>
      </div>
      <div class="index-container">
        <div class="index-menu">
          <template v-for="(v, k) in menu">
            <div
              v-if="k == menuIndex"
              class="second-menu active"
              :key="k"
              @click="selectMenu(k)"
            >
              {{ v.name }}
            </div>
            <div v-else class="second-menu" :key="k" @click="selectMenu(k)">
              {{ v.name }}
            </div>
          </template>
        </div>
        <div class="index-content">
          <v-tags @handle-tag="sideBarLinkage"></v-tags>
          <div class="content-container">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vTags from "./Tags.vue";
import bus from "@/assets/js/bus";
export default {
  data() {
    return {
      before: -1,
      active: 0,
      after: 1,
      sideBarNum: 0,
      menuIndex: 0,
      items: [],
      menu: [],
      tagsList: [],
      collapse: false,
    };
  },
  components: {
    vHead,
    vTags,
  },
  created() {
    this.getPermission();
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  methods: {
    selectBar(index) {
      this.active = index;
      this.after = parseInt(index) + 1;
      this.before = parseInt(index) - 1;
      this.menuIndex = 0;
      if (this.items[index]["children"] == undefined) {
        this.menu = [];
      } else {
        this.menu = this.items[index]["children"];
      }
      this.$router.push("/" + this.menu[0]["path"]);
    },
    selectMenu(index) {
      this.menuIndex = index;
      this.$router.push("/" + this.menu[index]["path"]);
    },
    // 菜单选中记忆
    sideBarLinkage() {
      var tree = JSON.parse(sessionStorage.getItem("spba-menu"));
      var that = this;
      var path = this.$route.path;
      tree.forEach(function (item, index) {
        item.children.forEach(function (val, key) {
          if ("/" + val.path == path) {
            that.menuIndex = key;
            that.active = index;
            that.after = parseInt(index) + 1;
            that.before = parseInt(index) - 1;
          }
        });
      });
      this.menu = tree[this.active]["children"];
    },
    // 获取权限
    getPermission() {
      this.items = JSON.parse(sessionStorage.getItem("spba-menu"));
      this.sideBarLinkage();
      if (this.items[this.active]["children"] == undefined) {
        this.menu = [];
      } else {
        this.menu = this.items[this.active]["children"];
      }
      this.sideBarNum = this.items.length;
    },
  },
};
</script>
<style lang="scss">
.index {
  width: 100%;
  height: 100%;
  display: flex;

  .index-left {
    width: 80px;
    height: 100%;
    font-size: 14px;
    background-color: #1c1c1e;

    .index-side-bar-container {
      background-color: #ffffff;

      .index-side-bar {
        width: 100%;
        height: 65px;
        color: #c2c2ca;
        text-align: center;
        background-color: #1c1c1e;

        img {
          width: 40px;
          height: 40px;
          margin: 12px 0;
        }
      }

      .index-side-bar.active {
        color: #409EFF;
        background-color: #ffffff;
        position: relative;

        .active-ele {
          position: absolute;
          left: 0px;
          top: 12px;
          width: 5px;
          height: 42px;
          border-radius: 0 4px 4px 0;
          background-color: #409EFF;
        }
      }

      .index-side-bar.before {
        border-radius: 0 0 4px 0;
      }

      .index-side-bar.after {
        border-radius: 0 4px 0 0;
      }
    }
  }

  .index-right {
    width: calc(100% - 80px);
    height: 100%;
    background-color: #e8eaed;

    .index-header {
      width: calc(100% - 80px);
      height: 55px;
      background-color: #ffffff;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      position: absolute;
    }

    .index-container {
      width: 100%;
      height: 100%;
      display: flex;
      padding-top: 50px;

      .index-menu {
        width: 120px;
        height: 100%;
        padding-top: 10px;
        background-color: #ffffff;
      }

      .second-menu {
        width: 63%;
        height: 29px;
        margin: 15px auto;
        border-radius: 2px;
        padding-left: 15px;
        font-size: 13px;
        line-height: 30px;
      }

      .second-menu.active {
        color: #ffffff;
        background-color: #409EFF;
      }

      .index-content {
        width: 100%;
        height: 100%;
        padding-top: 9px;
        font-size: 16px !important;
      }

      .content-container {
        height: calc(100% - 90px);
        margin: 3px 5px 10px 5px;
        overflow-y: scroll;
        background-color: #ffffff;
      }

      .content-container::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>