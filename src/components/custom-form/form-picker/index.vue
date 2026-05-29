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
import { setFormState, useFormWatch } from "../utils";

export default {
  name: "form-picker",
  components: {
    "t-icon": Icon,
    PickerPopup,
  },
  props: {
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
    useFormWatch(this.name, this, (value) => {
      this.value = value ?? null;
    });
  },
  methods: {
    onShow() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    confirm(data) {
      setFormState(this, { [this.name]: data });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.form-select {
  border: 1px solid #e1e1e1;
  height: rpx(80);
  border-radius: rpx(12);
  overflow: hidden;

  font-size: rpx(28);
  line-height: rpx(40);
  padding: rpx(12) rpx(24);
  box-sizing: border-box;
  color: #ccc;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &.select {
    color: #1e1e1e;
  }
}
</style>
