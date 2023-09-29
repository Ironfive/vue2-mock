<template>
  <div>
    <virtual-scroll ref="virtualScroll" :data="rows" :item-size="30" key-prop="id"
                    @change="onChange">
      <el-table
          highlight-current-row
          stripe
          border
          :lazy="true"
          v-loading="loading"
          @row-click="onRowClick"
          @row-dblclick="onRowDblclick"
          :data="virtualList"
          :row-height="30"
          :max-height="tableHeight"
          :row-key="(row) => row.id"
          ref="vTable">
        <slot/>
        <div slot="append">
          <el-divider>到底了~</el-divider>
        </div>
      </el-table>
    </virtual-scroll>
  </div>
</template>

<script>
import VirtualScroll from "el-table-virtual-scroll";
import {VirtualColumn} from "el-table-virtual-scroll";

export default {
  name: "VirutalTable",
  components: {
    VirtualScroll,
    VirtualColumn,
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: String,
      default: '584px'
    }
  },
  computed: {
    rows() {
      console.log(this.data, 1212)
      return this.data || []
    }
  },
  data() {
    return {
      startIndex: 0,
      virtualList: []
    }
  },
  methods: {
    // 虚拟列表的数据
    onChange(renderData, start, end) {
      this.startIndex = start; // 需要添加startIndex,真实的index = this.startIndex + rowIndex
      this.virtualList = renderData;
    },
    /**
     * 当某一行被点击时会触发该事件
     * @param row
     * @param column
     * @param event
     */
    onRowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    /**
     * 当某一行被点击时会触发该事件
     * @param row
     * @param column
     * @param event
     */
    onRowDblclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event);
    },
  }
}
</script>

<style scoped>

</style>