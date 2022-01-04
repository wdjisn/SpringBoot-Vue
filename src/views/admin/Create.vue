<template>
    <div class="admin-create">
        <el-form :model="form" :rules="rules" ref="createAdmin" label-width="75px">
            <el-form-item prop="username" label="管理员">
                <el-input v-model="form.username" placeholder="请输入管理员名称"></el-input>
            </el-form-item>
            <el-form-item prop="role_ids" label="角色">
                <el-cascader v-model="form.role_arr" :options="roles" :props="props" clearable style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input v-model="form.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="confirm_password" label="确认密码">
                <el-input v-model="form.confirm_password" placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <el-form-item label="状态">
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
import { roleList } from '../../api/role'
import { createAdmin } from '../../api/admin'
export default {
    name: 'createAdmin',
    data() {
        return {
            form: {
                username: '',
                password: '',
                confirm_password: '',
                role_arr: [],
                role_ids: '',
                status: '',
                status_name: true
            },
            query: {
                root: 0,
                page: 1,
                size: 1000
            },
            roles: [],
            loading: false,
            props: { multiple: true, label: 'name', value: 'id' },
            rules: {
                username: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
                role_arr: [{ required: true, message: '请选择角色', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                confirm_password: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取角色列表
        getData() {
            roleList(this.query).then((res) => {
                this.roles = res.data.records
            })
        },
        // 保存添加
        saveCreate() {
            this.$refs.createAdmin.validate((valid) => {
                if (valid) {
                    if (this.form.confirm_password != this.form.password) {
                        this.$message.error("确认密码和密码不一致")
                        return false
                    }
                    this.loading = true
                    if (this.form.status_name == true) {
                        this.form.status = 1
                    } else {
                        this.form.status = 0
                    }
                    var role_ids = ''
                    this.form.role_arr.forEach(function(item) {
                        role_ids += item[0] + ','
                    })
                    this.form.role_ids = role_ids
                    createAdmin(Qs.stringify(this.form)).then((res) => {
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
.admin-create .el-switch {
    margin-left: -30px;
}
</style>