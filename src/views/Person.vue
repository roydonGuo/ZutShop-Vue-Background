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
    <el-table class="user-table" :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column prop="uid" label="UID" width="100" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="avatar" label="头像地址"></el-table-column>
      <!-- <el-table-column label="角色" width="100">
        <template slot-scope="scope">
          {{ scope.row.roleList[0].role }}
        </template>
      </el-table-column> -->
      <el-table-column label="冻结" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDelete" :active-value="1" :inactive-value="0"
            @change="setUserActive(scope.row)" />
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
        :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 修改的dialog -->
    <el-dialog title="用户信息" :visible.sync="updateDialog" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像地址">
          <el-input v-model="form.avatar" autocomplete="off"></el-input>
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
    <el-dialog title="用户信息" :visible.sync="addDialog" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" autocomplete="off"></el-input>
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
      pageSize: 10,
      total: 0,
      username: "",
      phone: '',
      email: '',

      form: {},

      updateDialog: false,
      addDialog: false,
      multipleSelection: [],

      roles: [],
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
      })
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
    addUser(){
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
</style>