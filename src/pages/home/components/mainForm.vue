<template>
  <div>
      <div class="customForm">
      <el-form size="mini" :model="formValues" :rules="rules">
        <el-card>
          <span class="titleSection mb-5 mt-5">项目类型</span>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="所在地区" label-position="top" prop="area">
                <template slot="label">
                    <span>所在地区</span><i class="el-icon-location-outline" style="color:lightskyblue;" >定位</i>
                </template>
                <region-cascader v-model="formValues.area" class="fill-width" ></region-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用电类型" label-position="top" required prop="electricityUsageType">
                <el-select clearable class="fill-width" v-model="formValues.electricityUsageType" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="厂区电压等级" label-position="top" required>
                <el-select class="fill-width" v-model="formValues.factoryVoltagelevel" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="储能接入电压" label-position="top" required>
                <el-select class="fill-width" v-model="formValues.storageVoltageEnergy" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="储能系统时长" label-position="top" required>
                <el-select class="fill-width" v-model="formValues.storageVoltageTime" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <span class="titleSection mb-5 mt-5">测算模式</span>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-radio v-model="radio1" label="1" border>总收益最大</el-radio>
              <el-radio v-model="radio1" label="2" border>投资回收最快</el-radio>
            </el-col>
          </el-row>
          <span class="titleSection mb-5 mt-5">用电信息</span>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="变压器容量" label-position="top" required>
                <el-input class="fill-width" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form label-position="top" label="基本电费类型">
              <el-radio v-model="radio1" label="1" border>容量电费(根据变压器额定容量支付电费)</el-radio>
              <el-radio v-model="radio1" label="2" border>需量电费(根据用户实际使用量支付电费)</el-radio>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="最大容量比例" label-position="top" required>
                <el-input class="fill-width" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="用电量" label-position="top" required>
                <div >
                  <el-table
                      size="mini"
                      border
                      :data="tableData"
                      stripe
                      style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="month"
                        label="月份"
                        width="140"
                       >
                      <template slot-scope="scope">
                          <el-date-picker
                              @change="handleMonthSelectEm(scope.row)"
                              @clear="handleMonthClearEM(scope.$index,scope.row)"
                              size="small"
                              :picker-options="getPickerOptionsEM(scope.row)"
                              class="fill-width"
                              v-model="scope.row.month"
                              type="month"
                              value-format="yyyy-MM"
                              placeholder="选择年月">
                          </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="尖峰用电(Kwh)"
                        >
                      <template slot-scope="scope">
                        <el-input @blur="inputChange(scope.row.value1)" v-model="scope.row.value1" placeholder="请输入" class="fill-width"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="高峰用电(Kwh)">
                      <template slot-scope="scope">
                        <el-input @blur="inputChange(scope.row.value2)"  v-model="scope.row.value2" placeholder="请输入" class="fill-width"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="平时用电(Kwh)">
                      <template slot-scope="scope">
                        <el-input @blur="inputChange(scope.row.value3)"  v-model="scope.row.value3" placeholder="请输入" class="fill-width"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="低谷用电(Kwh)">
                      <template slot-scope="scope">
                        <el-input @blur="inputChange(scope.row.value4)"  v-model="scope.row.value4" placeholder="请输入" class="fill-width"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        type="action"
                        label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="handleDeleteEM(scope.$index, scope.row)" style="color:gray">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                </div>
                <el-button type="primary" size="mini" @click="handleAddEM" class="mt-5">新增</el-button>

              </el-form-item>
            </el-col>
          </el-row>
          <span class="titleSection mb-5 mt-5">区域电价</span>
          <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="用电量" label-position="top" required>
              <div>
                <el-table
                    border
                    :data="tableData"
                    stripe
                    style="width: 100%">
                  <el-table-column
                      align="center"
                      prop="date"
                      label="日期"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="name"
                      label="姓名"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="address"
                      label="地址">
                  </el-table-column>
                </el-table>
              </div>
              <el-button type="primary" @click="showUserInfo = true">进行测算</el-button>

            </el-form-item>
          </el-col>
        </el-row>
        </el-card>
      </el-form>
      </div>
    <user-info :visible.sync="showUserInfo"></user-info>
  </div>
</template>

<script>
import  regionCascader from '@/components/regionCascader/regionCascader.vue'
import getCurrentCityName from "@/utils/myBMap.js";
import userInfo from '@/pages/home/components/userInfo.vue'
export default {
  name: "mainForm",
  components:{
    regionCascader,
    userInfo
  },
  props:{
    visible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      showUserInfo:false,
      formValues:{
        area:[],
        electricityUsageType:'',
        factoryVoltagelevel:'',
        storageVoltageEnergy:'',
        storageVoltageTime:'',
        electricityCalculationMode:'1',
        transformerCapacity:''
      },
      rules:{
        area:[{require:true,message:'请选择地区',trigger:['blur','change'],type:'array'}],
        electricityUsageType:[{require:true,message:'请选择用电类型',trigger:['blur','change']}],
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      fullscreen:false,
      radio1: '1',
      tableData: [],
      pickerOptionsEM:[]
    }
  },
  computed:{
    dialogVisible:{
      get(){
        return this.visible
      },
      set(val){
        this.$emit('update:visible',val)
      }
    }
  },
  created() {
    this.getCurrentCity()
  },
  methods:{
    getCurrentCity(){
      let _this = this;
      getCurrentCityName.init().then(BMap=>{
        const geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          console.log(r)
          _this.formValues.area = [r.address.province,r.address.city]
        },function (e){
          console.log(e)
        },{
          provider:"baidu"
        })
      })
    },
    fullScreenFun(){
      this.fullscreen = !this.fullscreen;
    },
    handleClose(){
      this.dialogVisible = false;
    },
    handleEdit(index,row){
      console.log(index,row);
    },
    handleAddEM(){
      this.tableData.push({
        month:'',
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        disabled:false
      });
    },
    handleDeleteEM(index,row){
      this.tableData.splice(index,1);
      this.handleMonthClearEM(index,row)
    },
    getPickerOptionsEM(currentRow) {
      return {
        disabledDate: (date) => {
          const selectedMonths = this.pickerOptionsEM.filter(
              month => month !== currentRow.month
          );
          return selectedMonths.includes(this.formatMonth(date));
        }
      };
    },
    formatMonth(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份补零
      return `${year}-${month}`;
    },
    handleMonthSelectEm(row){
      this.pickerOptionsEM.push(row.month);
    },
    handleMonthClearEM(index,row){
      const monthIndex = this.pickerOptionsEM.indexOf(row.month);
      if (monthIndex > -1) {
        this.pickerOptionsEM.splice(monthIndex, 1);
      }
      row.month = '';
    },
    inputChange(value){
     if(!value || value ==''){
       value = '-'
     }
    },
    rotateTo(path){
      this.visible =false;
      this.$router.push({
        path
      })
    }
  }
}
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  margin-bottom: 20px;
}
::v-deep(.el-card__body){
  padding-top: 5px;
}
.flexAdd{
  display: flex;
  flex-direction: column;
}
</style>