<template>
  <div>
    <!-- 搜索 -->
    <div style="margin: 0 0 10px;display: inline-block;float: left;">
      <el-input style="width: 200px" placeholder="请输入商品名" suffix-icon="el-icon-search" class="mr-5"
        v-model="title"></el-input>
      <el-button type="primary" @click="loadGoods">搜索</el-button>
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
    <!-- 商品表单 -->
    <el-table class="goods-table" :data="tableData" border stripe @selection-change="handleSelectionChange"
      :default-sort="{ prop: 'priority', order: 'descending' }">
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column prop="gid" label="GID" width="100" align="center"></el-table-column>
      <el-table-column label="" width="120" align="center">
        <template slot-scope="scope">
          <img style="width: 100%; height: 100px;border-radius: 10px;" v-lazy=scope.row.image alt="图片加载失败" />
        </template>
      </el-table-column>
      <el-table-column prop="itemType" label="类型" width="120"></el-table-column>
      <el-table-column prop="title" label="商品"></el-table-column>
      <el-table-column prop="sellPoint" label="卖点"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="num" label="库存" width="100"></el-table-column>
      <el-table-column prop="priority" label="优先级" width="100" sortable></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
            icon-color="red" title="您确定删除吗？" @confirm="delRow(scope.row.gid)">
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div style="padding: 10px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- dialog -->
    <el-dialog title="商品信息" :visible.sync="dialog" width="60%">
      <el-form label-width="80px" size="small">
        <el-form-item label="商品图片">
          <el-tooltip placement="top">
            <div slot="content">点击上传图片</div>
            <el-upload class="image-upload"
              style="text-align: center; padding: 10px;weight:120px;height:240px;border:1px solid black;border-radius: 10px;"
              action="http://localhost:7777/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess">
              <img v-if="form.image" :src="form.image" class="avatar"
                style="border-radius: 10px;weight:260px;height:220px" />
              <i v-else style="font-size:50px;line-height: 200px;" :class="uploadTip" @click="willUpload"></i>
            </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="itemType">
              <el-input v-model="form.itemType" autocomplete="off"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="商品名" prop="title">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="卖点">
          <el-input type="textarea" v-model="form.sellPoint" autocomplete="off"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" autocomplete="off"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="num">
              <el-input v-model="form.num" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级" prop="priority">
              <el-input v-model="form.priority" autocomplete="off"></el-input>
            </el-form-item></el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      value: true,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: "",
      form: {},
      dialog: false,
      multipleSelection: [],
      uploadTip: "el-icon-plus avatar-uploader-icon"
    };
  },
  created() {
    // 请求分页查询数据
    this.loadGoods()
  },
  methods: {
    loadGoods() {
      this.request.get("/goods/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.title,
        }
      }).then(res => {
        // console.log(res)
        this.tableData = res.data.records
        this.total = Number(res.data.total)
      })
    },
    reset() {
      this.title = ''
      this.loadGoods()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadGoods()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadGoods()
    },
    willUpload() {
      this.uploadTip = "el-icon-loading"
    },
    handleAvatarSuccess(res) {
      // console.log(res);
      if (res.code === 200) {
        this.form.image = res.data.data;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },
    handleAdd() {
      this.dialog = true
      this.form = {}
    },
    addOrUpdateGoods() {
      console.log(this.form);
      this.request.post("/goods", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.dialog = false
          this.uploadTip = "el-icon-plus avatar-uploader-icon"
          this.loadGoods()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleEdit(row) {
      this.form = { ...row }
      this.dialog = true
    },
    cancel() {
      this.dialog = false
      this.uploadTip = "el-icon-plus avatar-uploader-icon"
    },
    delRow(id) {
      this.request.delete('/goods/del/' + id).then(res => {
        if (res.data) {
          this.$message.success("删除成功")
          this.loadGoods()
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
      let ids = this.multipleSelection.map(row => row.gid) // [{}, {}, {}] => [1,2,3]
      this.request.delete('/goods/del/batch', {
        data: ids
      }).then(res => {
        if (res.data) {
          this.$message.success("批量删除成功")
          this.pageNum = 1
          this.loadGoods()
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

.el-aside::-webkit-scrollbar {
  display: none;
}
</style>