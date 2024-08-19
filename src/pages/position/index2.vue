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
    <baidu-map
        style="display:flex;flex-direction: column-reverse;display: none"
        id="allmap"
        @ready="mapReady"
        @click="getLocation"
        :scroll-wheel-zoom="true"
    >
      <div style="display:flex;justify-content:center;margin:15px">
        <bm-auto-complete v-model="searchJingwei" :sugStyle="{zIndex: 999999}">
          <el-input v-model="searchJingwei" style="width:300px;margin-right:15px" placeholder="输入地址"></el-input>
        </bm-auto-complete>
        <el-button type="primary" @click="getBaiduMapPoint">搜索</el-button>
      </div>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-marker v-if="infoWindowShow" :position="{lng: longitude, lat: latitude}">
        <bm-label content="" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-info-window :position="{lng: longitude, lat: latitude}" :show="infoWindowShow" @clickclose="infoWindowClose">
        <p>纬度:{{this.latitude}}</p>
        <p>经度:{{this.longitude}}</p>
      </bm-info-window>
    </baidu-map>
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
  methods:{
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
      let that=this
      let myGeo = new this.BMap.Geocoder()
      myGeo.getPoint(this.searchJingwei,function(point){
        if(point){
          that.map.centerAndZoom(point,15)
          that.latitude=point.lat
          that.longitude=point.lng
          that.infoWindowShow=true
        }

      })
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (res) {
        that.selectedOptions = [res.address.province, res.address.city]
        console.log("当前位置经纬度",that.currentLocation,res)
      });
    },
    //信息窗口关闭
    infoWindowClose(){
      this.latitude=''
      this.longitude=''
      this.infoWindowShow=false
    },
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