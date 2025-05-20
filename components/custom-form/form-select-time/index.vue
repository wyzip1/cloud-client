<template>
  <view class="form-select-time">
    <select-time
      type="date"
      :value="value"
      placeholder="请选择日期"
      @change="onChange"
    />
  </view>
</template>

<script>
import selectTime from "../../select-time.vue";
export default {
  components: { selectTime },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
  },
  data() {
    return {
      value: null,
    };
  },
  created() {
    yz.event.trigger(
      "form-item-input" + "-" + this.pid + "-" + this.name,
      (parent) => {
        this._parent = parent;
        return this;
      }
    );
  },
  methods: {
    onChange(e) {
      this._parent.formChange(e.detail || e);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-select-time {
  font-size: 14px;
  line-height: 20px;
}
</style>
