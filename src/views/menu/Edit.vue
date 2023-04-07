<template>
    <div class="menu-edit">
        <el-form :rules="rules" ref="editMenu" :model="form" label-width="65px">
            <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="form.type" @change="changeType">
                    <el-radio label="M">目录</el-radio>
                    <el-radio label="C">菜单</el-radio>
                    <el-radio label="F">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="parentId" label="父级" v-if="parentVisible == true">
                <el-cascader v-model="form.parentId" :options="menus" :props="props" ref="selectParent" @change="changeParent()" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item prop="name" label="名称">
                <el-input v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item prop="perms" label="权限标识" v-if="permsVisible == true">
                <el-input v-model="form.perms" placeholder="请输入权限标识（C菜单、F按钮必填）"></el-input>
            </el-form-item>
            <el-form-item prop="path" label="组件路径" v-if="pathVisible == true">
                <el-input v-model="form.path" placeholder="请输入组件路径（C菜单必填）"></el-input>
            </el-form-item>
            <el-form-item prop="icon" label="图标" v-if="iconVisible == true">
                <el-input v-model="form.icon" placeholder="请输入图标类名，例：el-icon-lx-home（目录必填）"></el-input>
            </el-form-item>
            <el-form-item prop="sort" label="排序">
                <el-input v-model="form.sort" type="number" placeholder="请输入数字0~100"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="状态">
                <el-switch
                    class="tablescope"
                    v-model="form.statusName"
                    active-text="正常"
                    inactive-text="停用"
                ></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveEdit" :loading="loading">确定编辑</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Qs from "qs"
import { getMenu } from '../../api/menu'
import { menuList } from '../../api/menu'
import { editMenu } from '../../api/menu'
export default {
    name: 'edtiMenu',
    props: ['menuId'],
    data() {
        return {
            value: true,
            form: {
                id: '',
                type: 'M',
                parentId: '',
                name: '',
                perms: '',
                path: '',
                icon: '',
                sort: 0,
                status: 1,
                statusName: true
            },            
            parentVisible: false,
            permsVisible: false,
            pathVisible: false,
            iconVisible: true,
            menus: [],
            loading: false,
            props: { label: 'name', value: 'id' },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            this.getMenuInfo()
            this.getMenuList()
        },
        // 获取菜单详情
        getMenuInfo() {
            getMenu(this.menuId).then((res) => {
               this.form.id = res.data.id
               this.form.type = res.data.type
               this.form.parentId = res.data.parentId
               this.form.name = res.data.name
               this.form.perms = res.data.perms
               this.form.path = res.data.path
               this.form.icon = res.data.icon
               this.form.sort = res.data.sort
               this.form.status = res.data.status
               this.form.statusName = res.data.status == 1 ? true : false
                if (this.form.type == 'M') {
                    this.parentVisible = false
                    this.permsVisible = false
                    this.pathVisible = false
                    this.iconVisible = true
                } else if (this.form.type == 'C') {
                    this.parentVisible = true
                    this.permsVisible = true
                    this.pathVisible = true
                    this.iconVisible = false
                } else if (this.form.type == 'F') {
                    this.parentVisible = true
                    this.permsVisible = true
                    this.pathVisible = false
                    this.iconVisible = false
                }
            })
        },
        // 获取菜单列表
        getMenuList() {
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
                this.parentVisible = false
                this.permsVisible = false
                this.pathVisible = false
                this.iconVisible = true
                this.form.parentId = ''
                this.form.perms = ''
                this.form.path = ''
            } else if (this.form.type == 'C') {
                this.getMenuList()
                this.parentVisible = true
                this.permsVisible = true
                this.pathVisible = true
                this.iconVisible = false
                this.form.icon = ''
            } else if (this.form.type == 'F') {
                this.getMenuList()
                this.parentVisible = true
                this.permsVisible = true
                this.pathVisible = false
                this.iconVisible = false
                this.form.path = ''
                this.form.icon = ''
            }
        },
        // 选择父级
        changeParent() {
            var that = this;
            this.$refs.selectParent.getCheckedNodes().forEach(function (item) {
               that.form.parentId = item.value
            })
        },
        // 保存编辑
        saveEdit() {
            if (this.form.type == "C") {
                if (this.form.parentId == 0) {
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
                if (this.form.parentId == 0) {
                    this.$message.error("请选择父级菜单")
                    return false
                }
                if(this.form.perms == '') {
                    this.$message.error("请输入权限标识")
                    return false
                }
            }
            this.loading = true
            if (this.form.statusName == true) {
                this.form.status = 1
            } else {
                this.form.status = 0
            }
            this.form.parentId = this.form.parentId == '' ? 0 : this.form.parentId
            editMenu(Qs.stringify(this.form)).then((res) => {
                if (res.code == 200) {
                    this.$message.success('修改成功')
                    this.$emit('on-success', true)
                } else {
                    this.$message.error(res.message)
                    this.loading = false
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
.menu-edit .el-switch {
    margin-left: -30px;
}
</style>