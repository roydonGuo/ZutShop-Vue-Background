<template>

  <div>
    <!-- 搜索 -->
    <div style="margin: 0 0 10px;display: inline-block;float: left;">
      <el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" class="mr-5"
        v-model="username"></el-input>
      <el-input style="width: 200px" placeholder="请输入电话" suffix-icon="el-icon-position" class="mr-5"
        v-model="phone"></el-input>
      <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="mr-5"
        v-model="email"></el-input>
      <el-button type="primary" @click="loadPerson">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <!-- 增删操作 -->
    <div style="margin: 0 0 10px;display: inline-block;float: right">
      <el-button type="primary" class="mr-5" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <el-popconfirm class="mr-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
        icon-color="red" title="您确定批量删除这些数据吗？" @confirm="delBatch">
        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <!-- 用户表单 -->
    <el-table class="user-table" :data="tableData" border @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column prop="uid" label="UID" width="100" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column label="性别" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender === 1" :type="scope.row.gender === 1 ? 'primary' : 'warning'"
            disable-transitions>男</el-tag>
          <el-tag v-else-if="scope.row.gender === 0" :type="scope.row.gender === 0 ? 'warning' : 'primary'"
            disable-transitions>女</el-tag>
          <el-tag v-else :type="scope.row.gender === 1 ? 'primary' : 'info'" disable-transitions>未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" width="120"></el-table-column>
      <el-table-column prop="avatar" label="头像地址" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <img style="height: 32px;weight:32px;border-radius: 32px;" v-lazy=scope.row.avatar alt="图片加载失败" />
          <span>{{ scope.row.avatar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="120" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>权限: {{ scope.row.roleList[0].name }}</p>
            <p>描述: {{ scope.row.roleList[0].description }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag :type="scope.row.roleList[0].role === 'ROLE_ADMIN' ? 'primary' : 'info'" disable-transitions>{{
                  scope.row.roleList[0].role
              }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="冻结" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDelete" :active-value="1" :inactive-value="0"
            @change="setUserActive(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="权限" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUserRole(scope.row.uid)">权限分配<i
              class="el-icon-s-custom"></i></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
            icon-color="red" title="您确定删除吗？" @confirm="delRow(scope.row.uid)">
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 修改的dialog -->
    <el-dialog title="编辑用户信息" :visible.sync="updateDialog" width="30%">
      <el-form label-width="80px" size="small">
        <el-tooltip placement="top">
          <div slot="content">点击上传头像</div>
          <el-upload style="text-align: center; margin-bottom: 10px;" class="avatar-uploader"
            action="http://localhost:7777/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess">
            <img v-if="form.avatar" :src="form.avatar" class="avatar" style="border-radius: 50%" />
            <i style="font-size:50px" v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
        </el-tooltip>
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-radio v-model="form.gender" :label=1>男</el-radio>
          <el-radio v-model="form.gender" :label=0>女</el-radio></el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.role"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增的dialog -->
    <el-dialog title="新增用户" :visible.sync="addDialog" width="30%">
      <el-form label-width="80px" size="small">
        <el-tooltip placement="top">
          <div slot="content">点击上传头像</div>
          <el-upload style="text-align: center; margin-bottom: 10px;" class="avatar-uploader"
            action="http://localhost:7777/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess">
            <img v-if="form.avatar" :src="form.avatar" class="avatar" style="border-radius: 50%;object-fit: cover;" />
            <i style="font-size:50px" v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
        </el-tooltip>
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配用户权限" :visible.sync="roleDialog" width="30%">
      <el-form>
        <el-form-item label="选择权限:">
          <el-select v-model="userRid" placeholder="选择权限">
            <el-option v-for="role in roles" :key="role.id" :label="role.role" :value="role.rid"></el-option>
          </el-select></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Person",
  data() {
    return {
      value: true,
      tableData: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      username: "",
      phone: '',
      email: '',
      form: {},
      updateDialog: false,
      addDialog: false,
      roleDialog: false,
      multipleSelection: [],
      roles: [],
      userRid: 2,
      userRole: {},
      genderRadio: 1
    };
  },
  created() {
    // 请求分页查询数据
    this.loadPerson()
  },
  methods: {
    loadPerson() {
      this.request.get("/user/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          phone: this.phone,
          email: this.email,
        }
      }).then(res => {
        // console.log(res)
        this.tableData = res.data.records
        this.total = Number(res.data.total)
      })
      this.request.get("/role").then(res => {
        // console.log(res);
        this.roles = res.data
        this.userRid = res.data[0].rid
      })
    },
    handleUserRole(uid) {
      this.roleDialog = true;
      this.userRole.uid = uid
    },
    addUserRole() {
      // console.log(this.userRid);
      this.userRole.rid = this.userRid
      // console.log(this.userRole);
      this.request.post("/userRole/add", this.userRole).then(res => {
        if (res.code === 200) {
          this.$message.success("分配成功")
          this.roleDialog = false
          this.loadPerson()
        } else {
          this.$message.error("未知错误")
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(row);
      if (row.isDelete === 1) {
        return 'warning-row';
      }
      // } else if (rowIndex === 3) {
      //   return 'success-row';
      // }
      return '';
    },
    reset() {
      this.username = ''
      this.phone = ''
      this.email = ''
      this.loadPerson()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadPerson()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadPerson()
    },
    /* 设置冻结非冻结状态 */
    setUserActive(row) {
      this.request.post("/user/update", row).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.loadPerson()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleEdit(row) {
      // console.log(row);
      this.form = { ...row }
      this.updateDialog = true
    },
    update() {
      this.request.post("/user/update", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.updateDialog = false
          this.loadPerson()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAdd() {
      this.addDialog = true
      this.form = {}
    },
    addUser() {
      console.log(this.form);
      this.request.post("/user/add", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.addDialog = false
          this.loadPerson()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.form.avatar = res.data.data;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },
    delRow(id) {
      this.request.delete('/user/del/' + id).then(res => {
        if (res.data) {
          this.$message.success("删除成功")
          this.loadPerson()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    /* 批量删除 */
    delBatch() {
      let ids = this.multipleSelection.map(row => row.uid) // [{}, {}, {}] => [1,2,3]
      this.request.delete('/user/del/batch', {
        data: ids
      }).then(res => {
        if (res.data) {
          this.$message.success("批量删除成功")
          this.pageNum = 1
          this.loadPerson()
        } else {
          this.$message.error("批量删除失败")
        }
      })

    },

  }

};
</script>
<style scoped>
.user-table {
  margin: 10px 0;
}

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