<template>
    <div class="role-list">
        <div class="container">
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="mt20" @click="handleCreate" v-if="perms.indexOf('role:add') != -1">添加</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
            <el-table :data="data" class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="name" label="角色"></el-table-column>
                <el-table-column prop="adminCount" label="管理员数量" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
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
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" minWidth="170" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="perms.indexOf('role:query') != -1 && perms.indexOf('role:edit') != -1 && scope.row.root != 1" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            v-if="perms.indexOf('role:del') != -1 && scope.row.root != 1"
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
        <drawer title="添加角色" :display.sync="createVisible" :width="draweWidth">
            <create-role v-if="createVisible == true" @on-success="onSuccess"></create-role>
        </drawer>
        <!-- 编辑弹出框 -->
        <drawer title="编辑角色" :display.sync="editVisible" :width="draweWidth">
            <edit-role v-if="editVisible == true" :roleId="roleId" @on-success="onSuccess"></edit-role>
        </drawer>
    </div>
</template>

<script>
import createRole from './Create'
import editRole from './Edit'
import drawer from '../../components/Drawer'
import { roleList } from '../../api/role'
import { delRole } from '../../api/role'
export default {
    name: 'role',
    components: { createRole, editRole, drawer },
    data() {
        return {
            query: {
                username: '',
                page: 1,
                size: 15
            },
            total: 0,
            data: [],
            roleId: 0,
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
        // 获取角色列表
        getData() {
            roleList(this.query).then((res) => {
                this.data = res.data.records
                this.total = res.data.total
            })
        },
        // 刷新
        handleRefresh() {
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
            this.roleId = row.id
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
                delRole(row.id).then((res) => {
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
    margin-bottom: 20px;
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