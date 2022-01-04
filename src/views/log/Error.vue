<template>
    <div class="error-log">
        <div class="container">
            <div class="handle-box">
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
                <el-table-column label="相关参数" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div class="error-param">
                                <span class="error-title">Url:</span>
                                <el-tag type="warning">{{ scope.row.url }}</el-tag>
                            </div>
                            <div class="error-param">
                                <span class="error-title">Method:</span>
                                <el-tag type="success">{{ scope.row.method }}</el-tag>
                            </div>
                            <div class="error-param">
                                <span class="error-title">Time:</span>
                                <el-tag type="danger">{{ scope.row.create_time }}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="错误信息">
                    <template slot-scope="scope">
                        <div class="error-message">Message：{{ scope.row.message }}</div>
                        <div class="error-message">Params：{{ scope.row.params }}</div>
                        <div class="error-message">Exception：{{ scope.row.exception }}</div>
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
    </div>
</template>

<script>
import { errorLog } from '../../api/log'
export default {
    name: 'errorLog',
    data() {
        return {
            query: {
                start: '',
                end: '',
                page: 1,
                size: 15
            },
            total: 0,
            data: [],
            dateTime: []
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            errorLog(this.query).then((res) => {
                if (res.code == 200) {
                    this.data = res.data.records
                    this.total = res.data.total
                }
            })
        },
        // 重置
        handleReset() {
            this.$set(this.query, 'start', '')
            this.$set(this.query, 'end', '')
            this.dateTime = []
        },
        // 搜索
        handleSearch() {
            if (!this.dateTime) {
                this.dateTime = []
            }
            this.$set(this.query, 'page', 1)
            this.$set(this.query, 'start', this.dateTime[0])
            this.$set(this.query, 'end', this.dateTime[1])
            this.getData()
        },
        // 分页
        handlePageChange(val) {
            this.$set(this.query, 'page', val)
            this.getData()
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
.error-title {
    display: inline-block;
    width: 70px;
    color: #222;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
}
.error-param,
.error-message {
    text-align: left;
    padding-bottom: 6px;
    padding-top: 6px;
}
.el-tag.el-tag--danger,
.el-tag--small {
    font-size: 12px;
}

.error-status {
    position: absolute;
    width: 70px;
    height: 61px;
    top: 25px;
    right: 25px;
}
.error-status img {
    width: 100%;
    height: 100%;
}
</style>