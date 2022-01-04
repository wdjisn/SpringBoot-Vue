<template>
    <div class="operate-view">
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="info">操作编号：{{operate_log.id}}</div>
                        <div class="info">操作路径：{{operate_log.url}}</div>
                        <div class="info">操作时间：{{operate_log.create_time}}</div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="info">操作人员：{{operate_log.username}}</div>
                        <div class="info">请求方式：{{operate_log.method}}</div>
                        <div class="info">操作IP：{{operate_log.ip}}</div>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="info">请求参数：{{operate_log.params}}</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'operateview',
    props: ['operate_log']
}
</script>

<style lang="scss">
    .operate-view {
        .info {
            width: 100%;
            height: 50px;
            font-size: 14px;
            color: #606266;
            line-height: 30px;
        }
    }
</style>
