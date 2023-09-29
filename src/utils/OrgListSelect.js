const OrgListSelect = {
  template: `
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
    `,
  mixins: [MixSelect],
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  components: {
    "virtual-list": VirtualList,
  },
  data() {
    return {
      itemComponent: OptionNode,
      virtualOptions: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      $.common.ajax({
        url: `business/task/getOrgListByType`,
        async: true,
        method: "get",
        data: {
          type: this.type,
        },
        success: (res) => {
          if (res.code === 2000) {
            this.virtualOptions = res.data;
            this.optionsList = res.data;
            this.loading = false;
          }
        },
        error: () => {
          this.loading = false;
        },
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.optionsList = this.virtualOptions.filter((item) => {
          return item.abbr.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.optionsList = this.virtualOptions;
      }
    },
    visibleVirtualOptions(bool) {
      if (!bool) {
        this.$refs.virtualList.reset();
        setTimeout(() => {
          this.optionsList = this.virtualOptions;
        }, 20);
      }
    },
  },
};
