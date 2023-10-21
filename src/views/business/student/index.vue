<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="学生姓名">
          <el-input v-model.trim="params.name" clearable placeholder="学生姓名" @clear="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model.trim="params.status" clearable placeholder="状态" @change="search" @clear="search">
            <el-option label="未激活" value="1" />
            <el-option label="在学" value="10" />
            <el-option label="毕业" value="20" />
            <el-option label="退学" value="90" />
            <el-option label="删除" value="99" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="params.mobile" clearable placeholder="手机号" @clear="search" />
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model.trim="params.course" clearable placeholder="上课时间" @clear="search" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询学员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增学员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-edit" type="primary" @click="batchInClass">批量销课</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" prop="id" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="name" label="姓名" />
        <el-table-column show-overflow-tooltip sortable prop="age" label="年龄" />
        <el-table-column show-overflow-tooltip sortable prop="gender" label="性别" />
        <el-table-column show-overflow-tooltip sortable prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.status === '在学' ? 'success': scope.row.status === '毕业' ? 'success': 'danger'"
              disable-transitions
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="course" label="上课时间" />
        <el-table-column show-overflow-tooltip sortable prop="leftClassHour" label="剩余课时" />
        <el-table-column show-overflow-tooltip sortable prop="classHour" label="课时" />
        <el-table-column show-overflow-tooltip sortable prop="baseClassHour" label="基础课时" />
        <el-table-column show-overflow-tooltip sortable prop="freeClassHour" label="赠送课时" />
        <el-table-column show-overflow-tooltip sortable prop="inClassHour" label="销课课时" />
        <el-table-column show-overflow-tooltip sortable prop="signAmount" label="报名金额" />
        <el-table-column show-overflow-tooltip sortable prop="unitPrice" label="课程单价" />
        <el-table-column show-overflow-tooltip sortable prop="balance" label="余额" />
        <el-table-column show-overflow-tooltip sortable prop="mobile" label="手机号" />
        <el-table-column show-overflow-tooltip sortable prop="registDate" label="入学时间" />
        <el-table-column show-overflow-tooltip sortable prop="validateTime" label="有效时间" />
        <el-table-column show-overflow-tooltip sortable prop="creator" label="创建人" />
        <el-table-column show-overflow-tooltip sortable prop="extra" label="说明" />
        <el-table-column show-overflow-tooltip sortable prop="homeAddress" label="家庭住址" />
        <el-table-column show-overflow-tooltip sortable prop="gift" label="赠送礼品" />
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.id)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[50, 500]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">
          <el-form-item label="StudentID" prop="id">
            <el-input v-model.number="dialogFormData.ID" :readonly="true" placeholder="StudentID" />
          </el-form-item>
          <el-form-item label="学员姓名" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="学员姓名" />
          </el-form-item>
          <el-form-item label="学员年龄" prop="age">
            <el-input v-model.number="dialogFormData.age" placeholder="学员年龄" />
          </el-form-item>
          <el-form-item label="学员性别" prop="gender">
            <el-select v-model="dialogFormData.gender" placeholder="请选择性别" style="width:100%">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="dialogFormData.status" placeholder="请选择状态" style="width:100%">
              <el-option label="未激活" :value="1" />
              <el-option label="在学" :value="10" />
              <el-option label="毕业" :value="20" />
              <el-option label="退学" :value="90" />
              <el-option label="删除" :value="99" />
            </el-select>
          </el-form-item>
          <el-form-item label="总课时" prop="classHour">
            <el-input v-model.number="dialogFormData.classHour" placeholder="总课时" />
          </el-form-item>
          <el-form-item label="剩余课时" prop="leftClassHour">
            <el-input v-model.number="dialogFormData.leftClassHour" placeholder="剩余课时" />
          </el-form-item>
          <el-form-item label="报名费" prop="signAmount">
            <el-input v-model.number="dialogFormData.signAmount" placeholder="报名费" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.trim="dialogFormData.mobile" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="报名日期" prop="mobile">
            <el-date-picker v-model="dialogFormData.inDate" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import { getStudents, createStudent, updateStudent, batchDeleteStudentByIds, batchInClassByStudentIDs } from '@/api/business/student'

export default {
  name: 'Student',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      // 查询参数
      params: {
        name: '',
        openID: '',
        gender: 0,
        mobile: '',
        course: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // 角色
      roles: [],

      passwordType: 'password',

      publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbOYcY8HbDaNM9ooYXoc9s+R5o
R05ZL1BsVKadQBgOVH/kj7PQuD+ABEFVgB6rJNi287fRuZeZR+MCoG72H+AYsAhR
sEaB5SuI7gDEstXuTyjhx5bz0wUujbDK4VMgRfPO6MQo+A0c95OadDEvEQDG3KBQ
wLXapv+ZfsjG7NgdawIDAQAB
-----END PUBLIC KEY-----`,

      // dialog对话框
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        name: '',
        // age: 0,
        gender: 1,
        classHour: 0,
        leftClassHour: 0,
        signAmount: 0,
        status: 1,
        mobile: '',
        inDate: new Date()
      },
      dialogFormRules: {
        name: [
          { required: true, message: '请输入学员姓名名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        mobile: [
          { required: false, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getStudents(this.params)
        this.tableData = data.users
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增学员'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 修改
    update(row) {
      this.dialogFormData.ID = row.id
      this.dialogFormData.name = row.name
      this.dialogFormData.age = row.age
      this.dialogFormData.classHour = row.classHour
      this.dialogFormData.leftClassHour = row.leftClassHour
      this.dialogFormData.signAmount = row.signAmount
      this.dialogFormData.status = row.status
      this.dialogFormData.mobile = row.mobile
      // this.dialogFormData.inDate = row.inDate
      // this.dialogFormData.roleIds = row.roleIds
      // this.dialogFormData.ID = event.srcElement.dataset.id

      this.dialogFormTitle = '修改学员信息'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.submitLoading = true

          this.dialogFormDataCopy = { ...this.dialogFormData }
          let msg = ''
          try {
            if (this.dialogType === 'create') {
              const { message } = await createStudent(this.dialogFormDataCopy)
              msg = message
            } else {
              const { message } = await updateStudent(this.dialogFormDataCopy)
              msg = message
            }
          } finally {
            this.submitLoading = false
          }

          this.resetForm()
          this.getTableData()
          this.$message({
            showClose: true,
            message: msg,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '表单校验失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 提交表单
    cancelForm() {
      this.resetForm()
    },

    resetForm() {
      this.dialogFormVisible = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        name: '',
        age: 0,
        gender: 1,
        status: 1,
        mobile: '',
        signAmount: 0.0,
        classHour: 0,
        leftClassHour: 0
      }
    },

    // batchInClass
    batchInClass() {
      this.$confirm('此操作将批量销课, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const studentIDs = []
        this.multipleSelection.forEach(x => {
          studentIDs.push(x.id)
        })
        let msg = ''
        try {
          const { message } = await batchInClassByStudentIDs({ studentIDs: studentIDs })
          msg = message
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消销课'
        })
      })
    },

    // 批量删除
    batchDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const studentIDs = []
        this.multipleSelection.forEach(x => {
          studentIDs.push(x.id)
        })
        let msg = ''
        try {
          const { message } = await batchDeleteStudentByIds({ studentIDs: studentIDs })
          msg = message
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      let msg = ''
      try {
        const { message } = await batchDeleteStudentByIds({ studentIDs: [Id] })
        msg = message
      } finally {
        this.loading = false
      }

      this.getTableData()
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
  .container-card{
    margin: 10px;
  }

  .delete-popover{
    margin-left: 10px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
