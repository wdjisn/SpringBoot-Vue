<template>
<div class="admin-list">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.username" placeholder="请输入管理员名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </div>
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="mt20" @click="handleCreate" v-if="perms.indexOf('admin:add') != -1">添加</el-button>
            <el-table :data="data">
                <el-table-column prop="username" label="管理员"></el-table-column>
                <el-table-column prop="roles" label="角色" min-width="140"></el-table-column>
                <el-table-column prop="loginCount" label="登录次数" align="center"></el-table-column>
                <el-table-column prop="loginIp" label="最后登录IP" align="center" min-width="80"></el-table-column>
                <el-table-column prop="loginTime" label="最后登录时间" align="center" min-width="100"></el-table-column>
                <el-table-column label="状态" align="center" min-width="90">
                    <template slot-scope="scope">
                        <el-switch
                            class="tablescope"
                            v-model="scope.row.status"
                            active-color="#008080"
                            inactive-color="#dcdfe6"
                            active-text="开启"
                            inactive-text="关闭"
                            disabled
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="120">
                    <template slot-scope="scope">
                        &nbsp;
                        <el-button
                            style="margin-left: -4px"
                            v-if="perms.indexOf('admin:query') != -1 && perms.indexOf('admin:edit') != -1 && scope.row.root != 1"
                            icon="el-icon-edit"
                            type="primary"
                            @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            v-if="perms.indexOf('admin:del') != -1 && scope.row.root != 1"
                            icon="el-icon-delete"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.size"
                    :total="total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 添加弹出框 -->
        <drawer title="添加管理员" :display.sync="createVisible" :width="draweWidth">
            <create-admin v-if="createVisible == true" @on-success="onSuccess"></create-admin>
        </drawer>
        <!-- 编辑弹出框 -->
        <drawer title="编辑管理员" :display.sync="editVisible" :width="draweWidth">
            <edit-admin v-if="editVisible == true" :adminId="adminId" @on-success="onSuccess"></edit-admin>
        </drawer>
    </div>
</template>

<script>
import editAdmin from './Edit'
import createAdmin from './Create'
import drawer from '../../components/Drawer'
import { adminList } from '../../api/admin'
import { delAdmin } from '../../api/admin'
export default {
    name: 'admin',
    components: { createAdmin, editAdmin, drawer },
    data() {
        return {
            query: {
                username: '',
                page: 1,
                size: 15
            },
            total: 0,
            data: [],
            adminId: 0,
            createVisible: false,
            editVisible: false,
            draweWidth: '500px',
            perms: sessionStorage.getItem('spba-perms')
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取管理员列表
        getData() {
            adminList(this.query).then((res) => {
                this.data = res.data.records
                this.total = res.data.total
            })
        },
        // 重置
        handleReset() {
            this.$set(this.query, 'username', '')
        },
        // 搜索
        handleSearch() {
            this.$set(this.query, 'page', 1)
            this.getData()
        },
        // 分页
        handlePageChange(val) {
            this.$set(this.query, 'page', val)
            this.getData()
        },
        // 添加
        handleCreate() {
            this.createVisible = true
        },
        // 编辑
        handleEdit(row) {
            this.adminId = row.id
            this.editVisible = true
        },
        // 添加、编辑成功回调
        onSuccess() {
            this.createVisible = false
            this.editVisible = false
            this.getData()
        },
        // 删除
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                delAdmin(row.id).then((res) => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.getData()
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(() => {})
        }
    }
}
</script>

<style lang="scss">
.handle-box {
    margin-bottom: 15px;
}
.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
.mt20 {
    margin-bottom: 15px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.tablescope {
    .el-switch__label--left {
        position: relative;
        left: 55px;
        color: #fff;
        z-index: -100;
    }
    .el-switch__core {
        width: 55px !important;
    }
    .el-switch__label--right {
        position: relative;
        right: 55px;
        color: #fff;
        z-index: -100;
    }
    .el-switch__label--right.is-active {
        z-index: 100;
        color: #fff !important;
    }
    .el-switch__label--left.is-active {
        z-index: 100;
        color: #777777 !important;
    }
    .el-switch__label * {
        font-size: 12px;
    }
}
</style>