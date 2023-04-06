<template>
    <div class="menu-list">
        <div class="container">
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="mt20" @click="handleCreate" v-if="perms.indexOf('menu:add') != -1">添加</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
            <el-table :data="data" :default-expand-all="expandAll" row-key="id" :tree-props="tree_props">
                <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" min-width="130"></el-table-column>
                <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="icon" label="图标" align="center" min-width="80">
                    <template #default="scope">
                        <i :class="scope.row.icon" style="font-size: 18px"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="80" align="center"></el-table-column>
                <el-table-column label="状态" align="center" min-width="100">
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
                <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button 
                            v-if="perms.indexOf('menu:query') != -1 && perms.indexOf('menu:edit') != -1" 
                            icon="el-icon-edit" 
                            type="primary" 
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                        v-if="perms.indexOf('menu:del') != -1" 
                            icon="el-icon-delete"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加弹出框 -->
        <drawer title="添加菜单" :display.sync="createVisible" :width="drawerWidth">
            <create-menu v-if="createVisible == true" @on-success="onSuccess"></create-menu>
        </drawer>
        <!-- 编辑弹出框 -->
        <drawer title="编辑菜单" :display.sync="editVisible" :width="drawerWidth">
            <edit-menu v-if="editVisible == true" :menuId="menuId" @on-success="onSuccess"></edit-menu>
        </drawer>
    </div>
</template>

<script>
import editMenu from './Edit'
import createMenu from './Create'
import drawer from '../../components/Drawer'
import { delMenu } from '../../api/menu'
import { menuList } from '../../api/menu'
export default {
    name: 'menus',
    components: { createMenu, editMenu, drawer },
    data() {
        return {
            data: [],
            menuId: 0,
            createVisible: false,
            editVisible: false,
            drawerWidth: '500px',
            expandAll: true,
            perms: sessionStorage.getItem('spba-perms'),
            tree_props: { children: 'children', hasChildren: 'hasChildren' }           
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取菜单列表
        getData() {
            menuList({}).then((res) => {
                this.data = JSON.parse(JSON.stringify(res.data))
            })
        },
        // 刷新
        handleRefresh() {
            this.getData()
        },
        // 添加
        handleCreate() {
            this.createVisible = true
        },
        // 编辑
        handleEdit(row) {
            this.menuId = row.id
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
                delMenu(row.id).then((res) => {
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.handle-box {
    margin-bottom: 20px;
}
.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 12px;
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