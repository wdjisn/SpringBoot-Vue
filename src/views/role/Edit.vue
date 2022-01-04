<template>
    <div class="role-edit">
        <el-form :model="form" :rules="rules" ref="editRole" label-width="75px">
            <el-form-item prop="name" label="角色名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色状态">
                <el-switch
                    class="tablescope"
                    v-model="form.status_name"
                    active-color="#008080"
                    inactive-color="#dcdfe6"
                    active-text="开启"
                    inactive-text="关闭"
                ></el-switch>
            </el-form-item>
            <el-form-item prop="menu_arr" label="角色权限">
                <el-tree
                    :data="menus"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expand-all="true"
                    :props="props"
                ></el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveEdit" :loading="loading">确定编辑</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Qs from "qs"
import { menuList } from '../../api/menu'
import { roleInfo } from '../../api/role'
import { editRole } from '../../api/role'
export default {
    name: 'editRole',
    props: ['role_id'],
    data() {
        return {
            form: {
                id: 0,
                name: '',
                status: '',
                status_name: true,
                menu_arr: [],
                menu_ids: ''
            },
            menus: [],
            loading: false,
            props: { label: 'name', children: 'children' },
            rules: {
                name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
                menu_arr: [{ required: true, message: '请选择权限', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取菜单列表
        getData() {
            menuList({}).then((res) => {
                if (res.code == 200) {
                    this.menus = res.data
                }
                this.getInfo()
            })
        },
        // 获取角色详情
        getInfo() {
            roleInfo(this.role_id).then((res) => {
                if (res.code == 200) {
                    this.form.id = res.data.id
                    this.form.name = res.data.name
                    this.form.status = res.data.status
                    if (res.data.status == 1) {
                        this.form.status_name = true
                    }
                    if (res.data.status == 0) {
                        this.form.status_name = false
                    }
                    var that = this;
                    res.data.menu_ids.forEach((i) => {
                        // 获取tree中对应的节点
                        var node = that.$refs.tree.getNode(i);
                        // 判断节点是否为叶子节点
                        if(node.isLeaf){
                            that.$refs.tree.setChecked(node, true);
                        }
                    })
                }
            })
        },
        // 保存编辑
        saveEdit() {
            this.form.menu_arr = this.$refs.tree.getCheckedKeys()
            this.$refs.editRole.validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.form.status_name == true) {
                        this.form.status = 1
                    } else {
                        this.form.status = 0
                    }
                    this.form.menu_arr = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                    var menu_ids = ''
                    this.form.menu_arr.forEach(function(item) {
                        menu_ids += item + ','
                    })
                    this.form.menu_ids = menu_ids
                    editRole(Qs.stringify(this.form)).then((res) => {
                        if (res.code == 200) {
                            this.$message.success('编辑成功')
                            this.$emit('on-success', true)
                        } else {
                            this.$message.error(res.message)
                            this.loading = false
                        }
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
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
.role-edit .el-switch {
    margin-left: -30px;
}
</style>