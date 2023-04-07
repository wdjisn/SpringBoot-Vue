<template>
    <div class="operate-log">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.username" placeholder="请输入管理员名称" class="handle-input mr10"></el-input>
                <el-date-picker
                    class="mr10"
                    v-model="dateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </div>
            <el-table :data="data" class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="操作编号"></el-table-column>
                <el-table-column prop="url" label="操作路径"></el-table-column>
                <el-table-column prop="method" label="请求方式">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.method == 'POST'">{{ scope.row.method }}</el-tag> 
                        <el-tag v-else-if="scope.row.method == 'PUT'" type="warning">{{ scope.row.method }}</el-tag> 
                        <el-tag v-else-if="scope.row.method == 'DELETE'" type="danger">{{ scope.row.method }}</el-tag> 
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="操作人员"></el-table-column>
                <el-table-column prop="ip" label="操作IP"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" min-width="90px"></el-table-column>
                <el-table-column label="操作" minWidth="70" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.root != 1" icon="el-icon-view" type="primary" @click="handleView(scope.row)">详情</el-button>
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
        <drawer title="操作日志" :display.sync="viewVisible" :width="drawe_width">
            <operate-view v-if="viewVisible == true" :operateLog="operateLog"></operate-view>
        </drawer>
    </div>
</template>

<script>
import operateView from './OperateView'
import drawer from '../../components/Drawer'
import { operateLog } from '../../api/log'
export default {
    name: 'operatelog',
    components: { operateView, drawer },
    data() {
        return {
            query: {
                username: '',
                start: '',
                end: '',
                page: 1,
                size: 15
            },
            data: [],
            total: 0,
            dateTime: [],
            operateLog: {},
            viewVisible: false,
            drawe_width: '500px'
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            operateLog(this.query).then((res) => {
                if (res.code == 200) {
                    this.data = res.data.records
                    this.total = res.data.total
                }
            })
        },
        // 重置
        handleReset() {
            this.$set(this.query, 'username', '')
            this.$set(this.query, 'start', '')
            this.$set(this.query, 'end', '')
            this.dateTime = []
        },
        // 搜索
        handleSearch() {
            if (!this.dateTime) {
                this.dateTime = []
            }
            this.$set(this.query, 'start', this.dateTime[0])
            this.$set(this.query, 'end', this.dateTime[1])
            this.$set(this.query, 'page', 1)
            this.getData()
        },
        // 分页
        handlePageChange(val) {
            this.$set(this.query, 'page', val)
            this.getData()
        },
        // 详情
        handleView(row) {
            this.viewVisible = true
            this.operateLog = row
        }
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 15px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
