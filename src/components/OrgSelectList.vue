<template>
  <el-select
      ref="select"
      v-model="selectValue"
      :value-key="valueKey"
      :filterable="filterable"
      :clearable="clearable"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="loading"
      :style="{ width: width }"
      popper-class="virtualSelect"
      remote
      :remote-method="remoteMethod"
      @visible-change="visibleVirtualOptions"
      @change="selectChange"
      @clear="selectClear"
  >
    <virtual-list
        ref="virtualList"
        data-key="id"
        :dataSources="optionsList"
        :data-component="itemComponent"
        :extra-props="{
                    label: 'abbr',
                    value: 'id'
                }"
        :estimate-size="34"
        :keeps="20"
        style="max-height: 245px; overflow-y: auto;">
    </virtual-list>
  </el-select>
</template>

<script>
import virtualList from 'vue-virtual-scroll-list'
import ElOptionNode from "@/components/ElOptionNode";

export default {
  name: "OrgSelectList",
  props: {
    type: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: null
    },
    valueKey: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    width: {
      type: String,
      default: '100%'
    },
  },
  components: {
    'virtual-list': virtualList
  },
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  data() {
    return {
      itemComponent: ElOptionNode,
      virtualOptions: [],
      optionsList: [],
      loading: false
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      const sampleData = [];
      for (let i = 1; i <= 10000; i++) {
        sampleData.push({
          id: i,
          abbr: `Option ${i}`,
        });
      }
      this.virtualOptions = sampleData;
      this.optionsList = sampleData;
      this.loading = false;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.optionsList = this.virtualOptions.filter(item => {
          return item.abbr.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.optionsList = this.virtualOptions;
      }
    },
    visibleVirtualOptions(bool) {
      if (!bool) {
        this.$refs.virtualList.reset()
        setTimeout(() => {
          this.optionsList = this.virtualOptions;
        }, 20);
      }
    },
    selectChange(val) {
      this.$emit('on-select-change', val);
    },
    selectClear(val) {
      this.$emit('on-clear', val);
    }
  }
}
</script>

<style scoped>

</style>