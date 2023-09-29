<template>
  <div>
    <el-table stripe
              border
              highlight-current-row
              size="mini"
              v-loading="loading"
              :data="rows"
              :height="height"
              :max-height="tableHeight"
              @header-dragend="onHeaderDragend"
              @selection-change="onSelectionChange"
              @row-click="onRowClick"
              @row-dblclick="onRowDblclick"
              :show-summary="showSummary"
              :summary-method="summaryMethod"
              :span-method="spanMethod"
              @current-change="onCurrentChange">
      <slot/>
    </el-table>
    <Pagination v-if="totalPage>0" :total="totalPage" :page.sync="filter.pageNum" :limit.sync="filter.pageSize"
                @pagination="onPagination"/>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Pagination from '@/components/Pagination/index'

export default {
  name: 'tablePager',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    columns: Array,
    highlightRow: {
      type: Boolean,
      default: false
    },
    height: [String, Number],
    maxHeight: [String, Number],
    summaryMethod: {
      type: Function,
      default: function () {
      }//默认做的事情
    },
    spanMethod: {
      type: Function,
      default: function () {
      }//默认做的事情
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    filter: { // 过滤条件
      type: Object,
      default() {
        return {};
      }
    },
    entity: { // 添加一条记录实体
      type: Object,
      default() {
        return {};
      }
    },
    headerFixed: {
      type: Boolean,
      default: false
    },
    columnCompute: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      tabLoading: false,
    };
  },
  computed: {
    rows() {
      if (!this.data) {
        return [];
      }
      return this.data.rows || [];
    },
    totalPage() {
      if (!this.data) {
        return 0;
      }
      console.log(this.data.total)
      return this.data.total || 0;
    },
    tableHeight() {
      let recordNum = 10;// 分页大小
      if (this.maxHeight) {
        return this.maxHeight;
      }
      if (this.headerFixed && this.data && this.data.rows && this.data.rows.length > recordNum) {
        let scrollBarHeight = 18;
        let ivuTableSmallThHeight = 40; // small size 下的table表头单元格高度
        let ivuTableSmallTdHeight = 40; // small size 下的table表体单元格高度
        return ivuTableSmallThHeight + ivuTableSmallTdHeight * recordNum + scrollBarHeight;
      }
      return null;
    }
  },
  methods: {
    /**
     * 获取table单元格width
     * @param selection
     */
    getColWidth(column) {
      this.$nextTick(() => {
        let col = document.getElementsByClassName(column.id);
        let ths = col[0].parentNode.children;
        let cols = [];
        for (let index in ths) {
          let th = ths[index];
          let item = {};
          if (th.offsetWidth && th.offsetWidth > 0) {
            item.width = th.offsetWidth;
            let thChild = th.firstElementChild;
            if (th.className.indexOf(column.id) > -1) { // 被拖拽的列，设置列的最新宽度
              item.width = column.width;
            }
            let checkbox = thChild.getElementsByClassName('el-checkbox');
            if (checkbox && checkbox.length > 0) {
              item.title = '复选列';
            } else {
              item.title = th.innerText;
            }
            cols.push(item);
          }
        }
        console.log('cols', cols);
        // 按路由存储table的列宽
        Cookies.set(this.$router.currentRoute.path, cols, {expires: Infinity});
      });
    },
    /**
     * 表格表头拖动
     * 当拖动表头改变了列的宽度的时候会触发该事件
     * @param selection
     */
    onHeaderDragend(newWidth, oldWidth, column, event) {
      console.log('newWidth', newWidth);
      console.log('column', column);
      this.getColWidth(column);
    },
    /**
     * 表格行多选事件
     * @param selection
     */
    onSelectionChange(selection) {
      this.$emit('selection-change', selection);
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
    /**
     * 分页参数变更事件
     */
    onPagination() {
      // console.log(arguments)
      this.$emit('pagination', arguments);
    },
    /**
     * 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
     * @param currentRow
     * @param oldCurrentRow
     */
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow);
    }
  }
};
</script>
