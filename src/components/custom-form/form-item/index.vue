<template>
  <view>
    <view
      :class="['form-item', layout || formLayout || '']"
      :style="customStyle"
    >
      <view
        :class="{
          label: true,
          [labelAlign || formLabelAlign || '']: true,
          required: required || hasRequiredValidator,
        }"
        :style="formatLabelWidth + labelStyle"
      >
        <text v-if="!useLabelSlot">{{ label }}</text>
        <slot v-else name="label" />
      </view>

      <view :style="'flex:1;' + valueStyle">
        <view :class="['value', valueAlign || formValueAlign || '']">
          <slot />
        </view>
        <view class="err-tip" v-if="error">
          <view :class="['value', valueAlign || formValueAlign || '']">
            {{ errMsg }}
          </view>
        </view>
      </view>

      <view class="border" :style="borderStyle" v-if="border"></view>
    </view>
  </view>
</template>

<script>
import { convertCssSize } from "../../../utils";
import { getState } from "../../../utils/store";
import { regiterFormItem, setFormState, useFormWatch } from "../utils";
const mobileRegx = /^1[3-9]\d{9}$/;

export default {
  name: "form-item",
  props: {
    rules: {
      type: Array,
      default: () => [],
    },
    required: Boolean,
    border: Boolean,
    name: String,
    borderStyle: String,
    customStyle: String,
    useLabelSlot: Boolean,
    label: String,
    labelStyle: String,
    valueStyle: String,
    layout: String,
    labelWidth: null,
    valueAlign: String,
    labelAlign: String,

    initValue: null,
  },
  data() {
    return {
      error: false,
      errMsg: "",

      formLayout: "horizontal", // vertical,
      formLabelWidth: null,
      formValueAlign: "left",
      formLabelAlign: "right",
      value: null,
    };
  },
  computed: {
    formatLabelWidth() {
      return (
        "width: " +
        convertCssSize(this.labelWidth || this.formLabelWidth || 160) +
        ";"
      );
    },
    hasRequiredValidator() {
      return this.rules.some((rule) => rule.required);
    },
  },
  created() {
    regiterFormItem(this, (form) => {
      if (form.layout) {
        this.formLayout = form.layout;
      }
      if (form.defaultLabelWidth) {
        this.formLabelWidth = form.defaultLabelWidth;
      }
      if (form.valueAlign) {
        this.formValueAlign = form.valueAlign;
      }
      if (form.labelAlign) {
        this.formLabelAlign = form.labelAlign;
      }
    });
    useFormWatch(this.name, this, (value) => {
      this.value = value;
      this.error = false;
      this.errMsg = "";
    });
    if (
      [undefined, null].includes(getState(this, "formStore")[this.name]) &&
      this.initValue !== null
    ) {
      setFormState(this, { [this.name]: this.initValue });
    }
  },
  methods: {
    async validator() {
      const result = { error: false, errMsg: "" };
      for (const rule of this.rules) {
        try {
          if (typeof rule.validator === "function") {
            await rule.validator(this.value);
          } else if (rule.pattern) {
            const patternMap = {
              mobile: mobileRegx,
            };
            if (!patternMap[rule.pattern]) continue;
            if (!patternMap[rule.pattern].test(this.value)) {
              throw rule.message;
            }
          } else if (
            rule.required &&
            ((Array.isArray(this.value) && !this.value.length) ||
              ["", null, undefined].includes(this.value))
          ) {
            throw rule.message;
          }
        } catch (error) {
          result.error = true;
          result.errMsg = error;
          break;
        }
      }
      this.error = result.error;
      this.errMsg = result.errMsg;
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.form-item {
  word-break: break-all;
  position: relative;
}
.border {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  transform: scaleY(0.5);
}
.form-item.horizontal {
  padding: rpx(16) 0;
  display: flex;
  align-items: flex-start;
}

.form-item.horizontal .label {
  flex-shrink: 0;
  margin-right: rpx(24);
  padding: rpx(20) 0;
}

.form-item.vertical {
  & .label {
    margin-bottom: rpx(24);
  }
}

.label {
  position: relative;
  font-size: rpx(28);
  line-height: rpx(40);
  color: #1e1e1e;

  &.required::before {
    content: "*";
    color: #ff1a10;
  }
}

.form-item .label.left,
.form-item .value.left {
  text-align: left;
}

.form-item .label.right,
.form-item .value.right {
  text-align: right;
}

.form-item .value.right .form-select {
  display: flex;
  justify-content: flex-end;
}

.form-item .err-tip {
  width: 100%;
  color: red;
  font-size: 12px;
  line-height: 16px;
  margin-top: 4px;
}
</style>
