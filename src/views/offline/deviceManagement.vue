<template>

  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        label="工厂名称"
        prop="companyName"
        width="100"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="装置类别"
        prop="deviceType"
        width="100"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="装置标签号"
        prop="deviceTag"
        width="170"
      ></el-table-column>

      <el-table-column
        align="center"
        label="装置扩展号"
        prop="extensionNumber"
        width="70"
      ></el-table-column>

      <el-table-column
        align="center"
        label="电子标签号"
        prop="rfid"
        width="170"
      ></el-table-column>

      <el-table-column
        align="center"
        label="位置"
        prop="location"
        width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        align="center"
        label="介质"
        prop="media"
        width="80"
      ></el-table-column>

      <el-table-column
        align="center"
        label="是否可能泄漏"
        prop="leakpotential"
        width="70"
        :formatter="isLeakpotential2str"
      ></el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[2, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 创建和修改都是这个-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempDevice" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="工厂名" required>
          <el-input type="text" v-model="tempDevice.companyName">
          </el-input>
        </el-form-item>



        <el-form-item label="装置类别" required>
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="tempDevice.deviceType"
            :fetch-suggestions="getSuggestions('deviceType_list')"
            placeholder="请输入装置类别"
            @select="handleSelect">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>





        <el-form-item label="装置标签号" required>
          <el-input type="text" v-model="tempDevice.deviceTag">
          </el-input>
        </el-form-item>

        <el-form-item label="装置扩展号" required>
          <el-input type="text" v-model="tempDevice.extensionNumber">
          </el-input>
        </el-form-item>

        <el-form-item label="电子标签号" required>
          <el-input type="text" v-model="tempDevice.rfid">
          </el-input>
        </el-form-item>

        <el-form-item label="位置" required>
          <el-input type="text" v-model="tempDevice.location">
          </el-input>
        </el-form-item>

        <el-form-item label="介质" required>
          <el-input type="text" v-model="tempDevice.media">
          </el-input>
        </el-form-item>





      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createDevice">创 建</el-button>
        <el-button type="primary" v-else @click="updateDevice">修 改</el-button>
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
          pageRow: 2,//每页条数
        },

        dialogStatus: 'create',
        dialogFormVisible: false,   //默认对话框不显示
        textMap: {
          update: '编辑',
          create: '新建装置'
        },
        tempDevice: {
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



        input_suggestion: {},
        state: '',


      }
    },
    created() {
      this.getDeviceList();
    },
    methods: {

      isLeakpotential2str(row, column, cellValue) {
        return cellValue? "是": "否";
      },




      //查询装置列表
      getDeviceList() {

        this.listLoading = true;
        this.request({
          url: "/offline/device/list",
          method: "get",
          params: this.listQuery
        }).then(res => {
          this.listLoading = false;
          this.list = res.data.list;
          this.totalCount = res.data.totalCount;
        })
      },



      handleSizeChange(val) {

        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getDeviceList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getDeviceList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },

      showCreate() {
        this.loadSuggestion();
        //显示新增对话框
        this.tempDevice.companyName = "";
        this.tempDevice.deviceType = "";
        this.tempDevice.deviceTag = "";
        this.tempDevice.extensionNumber = "";
        this.tempDevice.rfid = "";
        this.tempDevice.location = "";
        this.tempDevice.media = "";
        this.tempDevice.leakpotential = false;

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },

      //input的输入建议
      getSuggestions(val) {
        return (queryString, cb) => {
          console.log("val = " + val);
          var suggestions = this.input_suggestion[val];
          console.log("suggestions = " + JSON.stringify(this.input_suggestion[val]));
          var results = queryString ? suggestions.filter(this.createFilter(queryString)) : suggestions;


          cb(results)
        }
      },
      createFilter(queryString) {
        return (restaurant) => {
          console.log("createFilter... restaurant = " + JSON.stringify(restaurant));
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);

        };
      },
      loadSuggestion() {
        this.request({
          url: "/offline/device/suggestion",
          method: "get",
          params: {}
        }).then(res => {
          this.input_suggestion = res.data;
          console.log("res.data = " + JSON.stringify(res.data))
        })
      },
      handleSelect(item) {

        // Object.assign(this.tempDevice, item);
        console.log("handleSelect...  item = " + JSON.stringify(item));
        this.tempDevice[item['name']] = item['value'];
      },
      handleIconClick(ev) {
        console.log(ev);
      },



      createDevice() {

      },
      updateDevice() {

      },
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
