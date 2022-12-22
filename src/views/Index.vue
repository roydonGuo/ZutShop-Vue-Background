<template>
  <el-container style="min-height: 100vh">

    <el-aside :width="sideWidth + 'px'" style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside :siteTitle="siteTitle"  ></Aside>
    </el-aside>

    <el-container>
      <el-header>
        <Header :user="user"></Header>
      </el-header>

      <el-main>
        <router-view @refreshUser="getUser"/>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import Aside from "@/components/Aside"
import Header from "@/components/Header"

export default {
  name: 'Index',
  components: {Aside, Header},

  data() {
    return {
      siteTitle: "后台管理系统",
      sideWidth: 200,
      user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {}
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    
    getUser() {
      this.request.get('/user/username/' + this.user.username).then(res => {
        console.log(res.data);
        this.user = res.data
      })
      .catch(res=>{
      this.$router.replace("/login")
      })
    }
  }

}
</script>

<style>

</style>
