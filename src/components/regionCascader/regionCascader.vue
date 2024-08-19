<template>
  <el-cascader
      @change="handleSelectChange"
      size="mini"
      :options="pcTextArr"
      v-model="selectedOptions"
      clearable
      filterable
  >
  </el-cascader>
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
  name: "regionCascader",
  props:{
    value:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      pcTextArr,
      pcaTextArr,
      regionData,
      provinceAndCityData,
    }
  },
  computed:{
    selectedOptions:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    }
  },
  methods:{
    handleSelectChange(){
      console.log(this.regionData,this.selectedOptions,222222)
    },
  }
}
</script>

<style scoped>

</style>