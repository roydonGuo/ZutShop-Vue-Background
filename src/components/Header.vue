<template>
  <div style="font-size: 14px; border-bottom: 1px solid #888; height: 60px;">
    <el-dropdown style="cursor: pointer;line-height: 1;float: right;">
      <div style="width:120px; height:60px;padding: 5px;">
        <div style="width: 50px; height: 50px; float:left; border-radius: 50%; overflow: hidden;">
          <img :src="user.avatar" alt="" width="50" height="50" />
        </div>
        <div style="float:left; margin-left:5px; color:white;line-height: 50px;color:black">
          <span>{{ user.username }}</span>
        </div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item style="font-size: 16px; padding: 10px">
          <router-link to="/user"><i class="el-icon-user"></i>个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 16px; padding: 10px;color: red">
          <span @click="logout"><i class="el-icon-coordinate"></i>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    user: Object
  },
  data() {
    return {
      // user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  methods: {
    logout() {
      this.$confirm("确定要退出登录?", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
          this.request.get("/user/logout").then((res) => {
            if (res.code === 200) {
              localStorage.removeItem("userInfo");
              localStorage.removeItem("_t");
              this.$router.push("/login");
              this.$message.success("退出成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
  },

}
</script>

<style scoped>

</style>