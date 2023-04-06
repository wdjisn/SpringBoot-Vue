<template>
    <div class="operate-view">
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="info">操作编号：{{operateLog.id}}</div>
                        <div class="info">操作路径：{{operateLog.url}}</div>
                        <div class="info">操作时间：{{operateLog.createTime}}</div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="info">操作人员：{{operateLog.username}}</div>
                        <div class="info">请求方式：{{operateLog.method}}</div>
                        <div class="info">操作IP：{{operateLog.ip}}</div>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="info">请求参数：{{operateLog.params}}</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'operateview',
    props: ['operateLog']
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
