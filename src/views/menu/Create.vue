<template>
    <div class="menu-create">
        <el-form :model="form" :rules="rules" ref="createMenu" label-width="65px">
            <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="form.type" @change="changeType">
                    <el-radio label="M">目录</el-radio>
                    <el-radio label="C">菜单</el-radio>
                    <el-radio label="F">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="parent_id" label="父级" v-if="parent_visible == true">
                <el-cascader :options="menus" :props="props" ref="selectParent" @change="changeParent()" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item prop="name" label="名称">
                <el-input v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item prop="perms" label="权限标识" v-if="perms_visible == true">
                <el-input v-model="form.perms" placeholder="请输入权限标识（C菜单、F按钮必填）"></el-input>
            </el-form-item>
            <el-form-item prop="path" label="组件路径" v-if="path_visible == true">
                <el-input v-model="form.path" placeholder="请输入组件路径（C菜单必填）"></el-input>
            </el-form-item>
            <el-form-item prop="icon" label="图标" v-if="icon_visible == true">
                <el-input v-model="form.icon" placeholder="请输入图标类名，例：el-icon-lx-home（目录必填）"></el-input>
            </el-form-item>
            <el-form-item prop="sort" label="排序">
                <el-input v-model="form.sort" type="number" placeholder="请输入数字0~100"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="状态">
                <el-switch
                    class="tablescope"
                    v-model="form.status_name"
                    active-color="#008080"
                    inactive-color="#dcdfe6"
                    active-text="开启"
                    inactive-text="关闭"
                ></el-switch>
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
import { createMenu } from '../../api/menu'
export default {
    name: 'createMenu',
    data() {
        return {
            form: {
                type: 'M',
                parent_id: '',
                name: '',
                perms: '',
                path: '',
                icon: '',
                sort: 0,
                status: 1,
                status_name: true
            },
            parent_visible: false,
            perms_visible: false,
            path_visible: false,
            icon_visible: true,
            menus: [],
            loading: false,
            props: { label: 'name', value: 'id' },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        }
    },
    methods: {
        // 获取菜单列表
        getData() {
            menuList().then((res) => {
                if (res.code == 200) {
                    var that = this
                    that.menus = []
                    if (this.form.type == "C") {
                        res.data.forEach(function(item) {
                            var tmp = {id: item.id, name: item.name}
                            that.menus.push(tmp)
                        })
                    } else if (this.form.type == "F") {
                        res.data.forEach(function(item) {
                            var children = [] 
                            item.children.forEach(function(val) {
                                var t = {id: val.id, name: val.name}
                                children.push(t)
                            })
                            var tmp = {id: item.id, name: item.name, children: children}
                            that.menus.push(tmp)
                        })
                    }
                }
            })
        },
        // 选择菜单类型
        changeType() {
            if (this.form.type == 'M') {
                this.parent_visible = false
                this.perms_visible = false
                this.path_visible = false
                this.icon_visible = true
                this.form.parent_id = ''
                this.form.perms = ''
                this.form.path = ''
            } else if (this.form.type == 'C') {
                this.getData()
                this.parent_visible = true
                this.perms_visible = true
                this.path_visible = true
                this.icon_visible = false
                this.form.icon = ''
            } else if (this.form.type == 'F') {
                this.getData()
                this.parent_visible = true
                this.perms_visible = true
                this.path_visible = false
                this.icon_visible = false
                this.form.path = ''
                this.form.icon = ''
            }
        },
        // 选择父级
        changeParent() {
            var that = this;
            this.$refs.selectParent.getCheckedNodes().forEach(function (item) {
               that.form.parent_id = item.value
            })
        },
        // 保存添加
        saveCreate() {
            this.$refs.createMenu.validate((valid) => {
                if (valid) {
                    if (this.form.type == "C") {
                        if (this.form.parent_id == 0) {
                            this.$message.error("请选择父级目录")
                            return false
                        }
                        if(this.form.perms == '') {
                            this.$message.error("请输入权限标识")
                            return false
                        }
                        if(this.form.path == '') {
                            this.$message.error("请输入组件路径")
                            return false
                        }
                    } else if (this.form.type == "F") {
                        if (this.form.parent_id == 0) {
                            this.$message.error("请选择父级菜单")
                            return false
                        }
                        if(this.form.perms == '') {
                            this.$message.error("请输入权限标识")
                            return false
                        }
                    }
                    this.loading = true
                    if (this.form.status_name == true) {
                        this.form.status = 1
                    } else {
                        this.form.status = 0
                    }
                    this.form.parent_id = this.form.parent_id == '' ? 0 : this.form.parent_id
                    createMenu(Qs.stringify(this.form)).then((res) => {
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
.menu-create .el-switch {
    margin-left: -30px;
}
</style>