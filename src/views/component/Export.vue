<template>
  <div class="export">
    <div class="container">
        <el-button type="primary" icon="el-icon-download" class="mt20" @click="handleExport">导出Excel</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="province" label="省份"></el-table-column>
            <el-table-column prop="city" label="市区"></el-table-column>
            <el-table-column prop="address" label="地址" width="300"></el-table-column>
            <el-table-column prop="zip" label="邮编"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import { json2excel } from '@/utils/common'
export default {
  name: "export",
  data() {
    return {
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }]
    }
  },
  methods: {
        handleExport() {
            var name = '导出Excel'
            var header = ['姓名', '省份', '市区', '地址', '邮编', '日期']
            var filter = ['name', 'province', 'city', 'address', 'zip', 'date']
            var data = this.tableData
            let excelDatas = [{
                sheetName: name,
                tHeader: header,
                filterVal: filter,
                tableDatas: data
            }]
            // 引入的函数
            json2excel(excelDatas, name, true, 'xlsx')
        }
    }
}
</script>

<style lang="scss">
.mt20 {
    margin-bottom: 15px;
}
</style>