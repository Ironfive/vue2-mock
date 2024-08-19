<template>
<div>
  <i class="el-icon-location-outline" style="color:lightskyblue;display: block" @click="getBaiduMapPoint"></i>
  <el-cascader
      @change="handleSelectChange"
      size="large"
      :options="pcTextArr"
      v-model="selectedOptions"
      clearable
      filterable
  >
  </el-cascader>
</div>
</template>

<script>
import {
  provinceAndCityData,
  pcTextArr,
  regionData,
  pcaTextArr,
  codeToText,
} from "element-china-area-data";
import getCurrentCityName from "@/utils/myBMap.js";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Option",
  data(){
    return{
      currentLocation:[],
      searchJingwei:'',
      infoWindowShow:false,
      longitude:'',
      latitude:'',
      point:'',
      provinceAndCityData,
      pcTextArr,
      regionData,
      pcaTextArr,
      codeToText,
      selectedOptions:[],
    }
  },
  created(){
this.getCurrentCity()
  },
  methods:{
    getCurrentCity(){
      getCurrentCityName.init().then(BMap=>{
        const geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          console.log(r)
      },function (e){
          console.log(e)
        },{
          provider:"baidu"
        })
    })
    },
    getCurrentPosition() {
      debugger
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            this.showPosition,
            this.errorPosition
        );
      } else {
        this.errorPositionTxt = "不支持获取用户当前位置";
        console.log("不支持获取用户当前位置");
      }
    },
    showPosition(position) {
      console.log(position);
      console.log(position.coords);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    },
    errorPosition(error) {
      switch (error.code) {
          // 不允许获取当前位置
        case error.PERMISSION_DENIED:
          this.errorPositionTxt = "不允许获取当前位置";
          break;
          // 无法获取当前位置
        case error.POSITION_UNAVAILABLE:
          this.errorPositionTxt = "无法获取当前位置";
          break;
          // 获取位置的请求超时。
        case error.TIMEOUT:
          this.errorPositionTxt = "获取位置请求超时。";
          break;
          // 获取位置操作超时
        case error.UNKNOWN_ERROR:
          this.errorPositionTxt = "获取位置操作超时";
          break;
      }
    },
    handleSelectChange(){
      console.log(this.regionData,this.selectedOptions,222222)
    },
    //地图初始化
    mapReady({ BMap, map }) {
      // 选择一个经纬度作为中心点
      this.point = new BMap.Point(113.27, 23.13);
      map.centerAndZoom(this.point, 12);
      let that = this
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (res) {
        that.selectedOptions = [res.address.province, res.address.city]
        console.log("当前位置经纬度",that.currentLocation,res)
      });
      this.BMap=BMap
      this.map=map
    },
    //点击获取经纬度
    getLocation(e){
      this.longitude=e.point.lng
      this.latitude=e.point.lat
      this.infoWindowShow=true
    },
    getBaiduMapPoint(){
      const geolocation = new BMap.Geolocation();
      var that = this
     geolocation.getCurrentPosition(function(position){
       that.selectedOptions = [position.address.province, position.address.city]
       console.log(position)
               }, function(e) {
               }, {provider: 'baidu'});
      // let myGeo = new this.BMap.Geocoder()
      // myGeo.getPoint(this.searchJingwei,function(point){
      //   if(point){
      //     that.map.centerAndZoom(point,15)
      //     that.latitude=point.lat
      //     that.longitude=point.lng
      //     that.infoWindowShow=true
      //   }
      //
      // })
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function (res) {
      //   that.selectedOptions = [res.address.province, res.address.city]
      //   console.log("当前位置经纬度",that.currentLocation,res)
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
#allmap{
  height: 100vh;
  width: 100vw;
  margin: 10px 0;
}
</style>