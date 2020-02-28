<template>

  <div class="app-container">
<!--    <h3>密封点管理</h3>-->
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate">添加
          </el-button>
          <el-button type="primary" icon="plus" @click="exportExcel">导出表格
          </el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table
      ref="filterTable"
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border fit
      highlight-current-row>

      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        label="所属装置"
        prop="deviceName"
        width="120"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="扩展号"
        prop="extensionNumber"
        width="70"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="装置类型"
        prop="deviceType"
        width="80"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="电子标签号"
        prop="rfid"
        width="130"
      ></el-table-column>

      <el-table-column
        align="center"
        label="位置"
        prop="location"
        width="200"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="介质"
        prop="media"
        width="80"
      ></el-table-column>


      <el-table-column align="center" label="管理" width="260">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="openPointInImage(scope.$index)">点位</el-button>
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeSealpoint(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 创建和修改都是这个-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempSealpoint" label-position="left" label-width="110px"
               style='width: 300px; margin-left:40px;'>






      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePointInImage">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { formatBoolean } from '@/utils/util'

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 5,//每页条数
        },

        dialogStatus: 'create',
        dialogFormVisible: false,   //默认对话框不显示
        textMap: {
          update: '编辑',
          create: '新建装置',
          point: '在所属装置中的点位'
        },
        tempSealpoint: {
          companyName: '',
          deviceType: '',
          deviceTag: '',
          extensionNumber: '',
          rfid: '',
          location: '',
          media: '',
          leakpotential: false,
          image: null   //图片
        },


      }
    },
    created() {
      this.getSealpointList();
    },
    methods: {



      //查询密封点列表
      getSealpointList() {
        //写死
        this.list = [
          {
            deviceName: 'AEU00010-01',
            extensionNumber: '01',
            deviceType: '法兰',
            rfid: '100001',
            location: 'P-1016 东1.1米 1层 0.8米',
            media: '轻液1',
          },
          {
            deviceName: 'AEU00010-01',
            extensionNumber: '02',
            deviceType: '法兰',
            rfid: '100002',
            location: 'P-1016 东1.1米 1层 0.8米',
            media: '轻液1',
          },
          {
            deviceName: 'AEU00010-02',
            extensionNumber: '01',
            deviceType: '法兰',
            rfid: '100003',
            location: 'P-1016 东1.5米 1层 0.9米',
            media: '轻液1',
          },
          {
            deviceName: 'AEU00010-02',
            extensionNumber: '02',
            deviceType: '法兰',
            rfid: '100004',
            location: 'P-1016 东1.5米 1层 0.9米',
            media: '轻液1',
          },
          {
            deviceName: 'AEU00051-01',
            extensionNumber: '01',
            deviceType: '阀门',
            rfid: '100005',
            location: 'P-1016 东3.3米 1层 1.1米',
            media: '轻液2',
          },
        ]
      },


      //改变每页数量
      handleSizeChange(val) {
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      //改变页码
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getSealpointList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getSealpointList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },

      showCreate() {
        this.loadSuggestion();
        //显示新增对话框
        this.tempSealpoint.companyName = "";
        this.tempSealpoint.deviceType = "";
        this.tempSealpoint.deviceTag = "";
        this.tempSealpoint.extensionNumber = "";
        this.tempSealpoint.rfid = "";
        this.tempSealpoint.location = "";
        this.tempSealpoint.media = "";
        this.tempSealpoint.leakpotential = false;

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        this.loadSuggestion();
        let sealpoint = this.list[$index];
        //console.log("当前的device = " + JSON.stringify(device));
        this.tempSealpoint.companyName = sealpoint.companyName;
        this.tempSealpoint.deviceType = sealpoint.deviceType;
        this.tempSealpoint.deviceTag = sealpoint.deviceTag;
        this.tempSealpoint.extensionNumber = sealpoint.extensionNumber;
        this.tempSealpoint.rfid = sealpoint.rfid;
        this.tempSealpoint.location = sealpoint.location;
        this.tempSealpoint.media = sealpoint.media;
        this.tempSealpoint.leakpotential = sealpoint.leakpotential;
        this.tempSealpoint.deviceId = sealpoint.id;

        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },




      //添加新密封点
      createSealpoint() {


      },
      //修改密封点
      updateSealpoint() {

      },
      //删除密封点
      removeSealpoint($index) {

      },
      //打开点位
      openPointInImage() {
        console.log("打开点位...")
        this.dialogFormVisible = true;
        this.dialogStatus = "point"
      },
      //处理点位
      handlePointInImage() {
        console.log("处理点位...")
      },


      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      filterTag(value, row) {
        return row.deviceType === value;
      },


      exportExcel() {

      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .highlighted .addr {
    color: #ddd;
  }
  }
  }
</style>

