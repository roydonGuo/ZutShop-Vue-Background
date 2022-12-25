<template>
  <div class="wrapper">
    <!-- 搜索 -->
    <div style="margin: 0 0 10px;display: inline-block;float: left;">
      <el-input style="width: 200px" placeholder="请输入分类名" suffix-icon="el-icon-search" class="mr-5"
        v-model="name"></el-input>
      <el-button type="primary">搜索</el-button>
      <el-button type="warning">重置</el-button>
    </div>
    <!-- 增删操作 -->
    <div style="margin: 0 0 10px;display: inline-block;float: right">
      <el-button type="primary" class="mr-5">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <el-popconfirm class="mr-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
        icon-color="red" title="您确定批量删除这些数据吗？" @confirm="delBatch">
        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border
      @selection-change="handleSelectionChange" :tree-props="{ children: 'chileList', hasChildren: 'hasChildren' }">
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column prop="name" label="分类">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'primary' : 'warning'" disable-transitions>{{ scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" sortable width="180">
      </el-table-column>
      <el-table-column prop="createdUser" label="创建人" width="100">
      </el-table-column>
      <el-table-column prop="modifiedUser" label="修改人" width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "GoodsCategory",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      name: "",
    }
  },
  created() {
    this.loadGoodsCategory()
  },
  methods: {
    loadGoodsCategory() {
      this.request.get("/goodsCategory/tree").then(res => {
        // console.log(res)
        this.tableData = res.data
      })
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    /* 批量删除 */
    delBatch() {
      let ids = this.multipleSelection.map(row => row.id) // [{}, {}, {}] => [1,2,3]
      this.request.delete('###', {
        data: ids
      }).then(res => {
        if (res.data) {
          this.$message.success("批量删除成功")
          this.loadGoodsCategory()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
  }
}
</script>

<style>

</style>
