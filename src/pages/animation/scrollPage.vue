<template>
  <div>
    <div
        class="content-wrapper"
        :class="{ expanded: isOpen }"
    >
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    open:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    isOpen:{
      get(){
        return this.open
      },
      set(val){
        this.$emit('update:open',val)
      }

    }
  },
  data() {
    return {
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  overflow: hidden;
  transform-origin: center;
  transition: transform 0.5s ease-in-out;
  transform: scaleX(0);
}

.content-wrapper.expanded {
  transform: scaleX(1);
}

.content {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
