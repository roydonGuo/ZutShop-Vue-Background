<template>
  <el-card style="max-width: 400px; margin: auto">
    <el-form label-width="80px" size="small" :model="form" :rules="rules" ref="UpdateUserForm">
      <el-tooltip placement="top">
        <div slot="content">点击上传头像</div>
        <el-upload style="text-align: center; margin-bottom: 10px" class="avatar-uploader"
          action="http://localhost:7777/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess">
          <img v-if="form.avatar" :src="form.avatar" class="avatar" style="border-radius: 50%" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
      </el-tooltip>
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-button type="primary" @click="save">更 新 信 息</el-button>

    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Person",
  data() {
    return {
      form: {},
      user: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : {},
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      if (this.user.uid) {
        this.form = (await this.request.get("/user/" + this.user.uid)).data;
        if (this.form) {
          // console.log(this.form);
        } else {
          this.$message.error("请登录");
        }
      }
    },
    save() {
      this.$refs["UpdateUserForm"].validate((valid) => {
        if (valid) {
          this.request.post("/user/update", this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success("保存成功");
              /* 更新浏览器存储*/
              this.$emit('refreshUser')
              localStorage.setItem("userInfo", JSON.stringify(this.form));
            } else {
              this.$message.error("保存失败");
            }
          });
        }
      });
    },

    handleAvatarSuccess(res) {
      // console.log(res);
      if (res.code === 200) {
        this.form.avatar = res.data.data;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>