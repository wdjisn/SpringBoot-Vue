<template>
    <div class="role-create">
        <el-form :model="form" :rules="rules" ref="createRole" label-width="75px">
            <el-form-item prop="name" label="角色名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色状态">
                <el-switch
                    class="tablescope"
                    v-model="form.statusName"
                    active-color="#008080"
                    inactive-color="#dcdfe6"
                    active-text="开启"
                    inactive-text="关闭"
                ></el-switch>
            </el-form-item>
            <el-form-item prop="menuArr" label="角色权限">
                <el-tree :data="menus" show-checkbox node-key="id" ref="tree" :check-strictly="false" :default-expand-all="true" :props="props"></el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveCreate" :loading="loading">确定添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Qs from "qs"
import { menuList } from '../../api/menu'
import { createRole } from '../../api/role'
export default {
    name: 'createRole',
    data() {
        return {
            query: {},
            form: {
                name: '',
                status: '',
                statusName: true,
                menuArr: [],
                menuIds: ''
            },
            menus: [],
            loading: false,
            props: { label: 'name', children: 'children' },
            rules: {
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                menuArr: [{ required: true, message: '请选择权限', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取菜单列表
        getData() {
            menuList(this.query).then((res) => {
                if (res.code == 200) {
                    this.menus = res.data 
                }
            })
        },
        // 保存添加
        saveCreate() {
            this.form.menuArr = this.$refs.tree.getCheckedKeys()
            this.$refs.createRole.validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.form.statusName == true) {
                        this.form.status = 1
                    } else {
                        this.form.status = 0
                    }
                    this.form.menuArr = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                    var menuIds = ''
                    this.form.menuArr.forEach(function(item) {
                        menuIds += item + ','
                    })
                    this.form.menuIds = menuIds
                    createRole(Qs.stringify(this.form)).then((res) => {
                        if (res.code == 200) {
                            this.$message.success('添加成功')
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
.role-create .el-switch {
    margin-left: -30px;
}
</style>