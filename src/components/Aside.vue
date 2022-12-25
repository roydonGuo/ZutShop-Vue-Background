<template>
  <el-menu style="height: 100%;width:200px ;overflow: hidden" background-color="#545c66" text-color="#fff" router
    active-text-color="gold" @select="handleSelect">
    <div style="height: 60px; line-height: 60px; text-align: center;background:#409eff">
      <img src="../assets/logo.png" alt="" style="width: 24px; position: relative; top: 6px;">
      <b style="color: white;font-size: 18px">{{ siteTitle }}</b>
    </div>

    <el-menu-item index="/">
      <template slot="title">
        <i class="el-icon-house"></i>
        <span slot="title">系统主页</span>
      </template>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="person">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="role">
        <i class="el-icon-set-up"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="/menu">
        <i class="el-icon-s-custom"></i>
        <span slot="title">菜单管理</span>
      </el-menu-item> -->
      <el-menu-item index="/goodsCategory">
        <i class="el-icon-folder-opened"></i>
        <span slot="title">商品分类</span>
      </el-menu-item>
      <el-menu-item index="/goods">
        <i class="el-icon-shopping-bag-1"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    siteTitle: String,
  },
  data() {
    return {
    }
  },
  methods: {
    handleSelect(index) {
      // console.log(this.$router.options.routes)
    }
  }
}
</script>

<style scoped>

</style>