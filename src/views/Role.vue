<template>
  <div>
    <!-- 搜索 -->
    <div style="margin: 0 0 10px;display: inline-block;float: left;">
      <el-input style="width: 200px" placeholder="请输入角色名(中文)" suffix-icon="el-icon-search" class="mr-5"
        v-model="name"></el-input>
      <el-button type="primary" @click="loadRoles">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <!-- 增删操作 -->
    <div style="margin: 0 0 10px;display: inline-block;float: right">
      <el-button type="primary" class="mr-5" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </div>
    <!-- 表单 -->
    <el-table class="goods-table" :data="tableData" border stripe>
      <el-table-column prop="rid" label="RID" width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="角色" width="120"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="role" label="role"></el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'primary' : 'warning'" disable-transitions>
            <strong v-if="scope.row.status === 0">可用</strong>
            <strong v-else>禁用</strong>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
            icon-color="red" title="您确定删除吗？" @confirm="delRow(scope.row.rid)">
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div style="padding: 10px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增用户" :visible.sync="addRoleDialog" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="角色名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="role">
          <el-input v-model="form.role" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用">
          <el-switch v-model="form.status" :active-value="0" :inactive-value="1" @change="setRoleStatus()" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: "",
      form: {},
      addRoleDialog: false,
    };
  },
  created() {
    // 请求分页查询数据
    this.loadRoles()
  },
  methods: {
    loadRoles() {
      this.request.get("/role/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = Number(res.data.total)
      })
    },
    reset() {
      this.name = ''
      this.loadRoles()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadRoles()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadRoles()
    },
    handleEdit(row) {
      // console.log(row);
      this.form = { ...row }
      this.addRoleDialog = true
    },
    addRole() {
      this.request.post("/role", this.form).then((res) => {
        if (res.code === 200) {
          this.$message.success("添加成功")
          this.addRoleDialog = false
          this.loadRoles()
        } else {
          this.$message.error("添加失败")
        }
      })
    },
    setRoleStatus() {
      console.log(this.form.status);
    },
    handleAdd() {
      this.addRoleDialog = true
      this.form = {}
    },
    delRow(id) {
      this.request.delete('/role/del/' + id).then(res => {
        if (res.data === true) {
          this.$message.success("删除成功")
          this.loadRoles()
        } else {
          this.$message.error("删除失败，请先设置禁用")
        }
      })
    },

  }
};
</script>
<style scoped>

</style>