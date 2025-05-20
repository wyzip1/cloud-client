<template>
  <view>
    <view :class="{ 'form-select': true, select: !!valueText }" @click="onShow">
      <text>{{ valueText || placeholder || "请选择" }}</text>
      <t-icon class="icon" name="arrow-down" size="10px" />
    </view>

    <picker-popup
      :show="show"
      :title="placeholder"
      :columns="columns"
      :fullValue="fullValue"
      :value="value"
      :options="options"
      :fieldsName="fieldsName"
      @close="onClose"
      @confirm="confirm"
    />
  </view>
</template>

<script>
import { Icon } from "@youzan-cloud/tee-ui";
import { findTreePath } from "../../../utils";
import PickerPopup from "./picker-popup.vue";

export default {
  components: {
    "t-icon": Icon,
    PickerPopup,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
    placeholder: String,
    columns: {
      type: Number,
      default: 1,
    },
    fullValue: Boolean,
    options: Array,
    fieldsName: Object,
  },
  computed: {
    valueText() {
      const value = this.fullValue
        ? this.value?.[this.value?.length - 1]?.value
        : this.value;
      const values =
        findTreePath(
          this.options || [],
          (item) => item[this.fieldsName?.value || "value"] === value
        ) || [];

      return (
        values.map((v) => v[this.fieldsName?.label || "label"]).join("-") || ""
      );
    },
  },
  data() {
    return {
      value: null,
      show: false,
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
    onShow() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    confirm(data) {
      console.log("data", data);
      this._parent.formChange(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-select {
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;

  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.select {
    font-size: 14px;
    color: #333;
  }
}

.icon {
  margin-left: 5px;
}
</style>
