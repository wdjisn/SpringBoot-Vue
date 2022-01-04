<template>
    <div class="admin-edit">
        <el-form :rules="rules" ref="editAdmin" :model="form" label-width="65px">
            <el-form-item prop="username" label="用户名">
                <el-input v-model="form.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
                <span class="admin-edit-tips">非必填，修改密码时可填</span>
            </el-form-item>
            <el-form-item prop="role_ids" label="角色">
                <el-cascader v-model="form.role_arr" :options="roles" :props="props" clearable style="width: 100%"></el-cascader>
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
                <el-button type="primary" @click="saveEdit" :loading="loading">确定编辑</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Qs from "qs"
import { roleList } from '../../api/role'
import { getAdmin } from '../../api/admin'
import { editAdmin } from '../../api/admin'
export default {
    name: 'edtiAdmin',
    props: ['admin_id'],
    data() {
        return {
            form: {
                id: 0,
                username: '',
                password: '',
                role_arr: [],
                role_ids: '',
                status: 0,
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
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                role_ids: [{ required: true, message: '请选择角色', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            getAdmin(this.admin_id).then((res) => {
                if (res.code == 200) {
                    this.form.id = res.data.id
                    this.form.username = res.data.username
                    this.form.role_arr = res.data.role
                    this.form.status_name = res.data.status == 1 ? true : false
                }
            })
            roleList(this.query).then((res) => {
                this.roles = res.data.records
            })
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            if (this.form.status_name == true) {
                this.form.status = 1
            } else {
                this.form.status = 0
            }
            var role_ids = ''
            this.form.role_arr.forEach(function(item) {
                role_ids += item + ','
            })
            this.form.role_ids = role_ids
            editAdmin(Qs.stringify(this.form)).then((res) => {
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
.admin-edit .el-switch {
    margin-left: -30px;
}
</style>