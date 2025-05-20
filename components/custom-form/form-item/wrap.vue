<template>
  <view
    :class="['form-item', layout || formLayout || '']"
    :style="
      '--label-width: ' +
      (labelWidth || formLabelWidth || '80px') +
      ';' +
      customStyle
    "
  >
    <view
      :class="{
        label: true,
        [labelAlign || formLabelAlign || '']: true,
        required: showRequired && required,
      }"
      :style="labelStyle"
      @click="labelTap"
    >
      <view v-if="!useLabelSlot">{{ label }}</view>
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

    <view class="border" v-if="border"></view>
  </view>
</template>

<script>
import { guid } from "../../../utils";

export default {
  props: {
    pid: {
      type: String,
      default: "base",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    showRequired: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    name: String,
    customStyle: String,
    useLabelSlot: Boolean,
    label: String,
    labelStyle: String,
    valueStyle: String,
    layout: String,
    labelWidth: String,
    valueAlign: String,
    labelAlign: String,

    initValue: null,
  },
  data() {
    return {
      error: false,
      errMsg: "",
      uid: guid(),

      formLayout: "horizontal", // vertical,
      formLabelWidth: null,
      formValueAlign: "left",
      formLabelAlign: "right",
      value: "",
    };
  },
  computed: {
    required() {
      return this.rules.some((rule) => rule.required);
    },
  },
  created() {
    yz.event.on(
      "form-item-input" + "-" + this.pid + "-" + this.name,
      (callback) => {
        if (!this.yz.page.form.getEnabled()) return;
        this._context = callback(this);
        if (!["", null, undefined].includes(this.initValue)) {
          this.formChange(this.initValue);
        }
      }
    );
  },
  mounted() {
    yz.event.trigger("form-item-mounted" + "-" + this.pid, {
      id: this.uid,
      context: this,
    });
  },
  destroyed() {
    yz.event.trigger("form-item-destroyed" + "-" + this.pid, {
      id: this.uid,
    });
  },
  methods: {
    async validator() {
      const result = { error: false, errMsg: "" };
      for (const rule of this.rules) {
        try {
          if (typeof rule.validator === "function") {
            await rule.validator(this.value);
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
    labelTap() {
      this.$emit("label-click");
    },
    formChange(value) {
      this.value = value;
      this.error = false;
      this.errMsg = "";

      this._context.value = value;

      this.yz.page.form?.triggerValueChange(this.name, value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item {
  word-break: break-all;
  position: relative;
}
.border {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  transform: scaleY(0.5);
}
.form-item.horizontal {
  padding: 16px 0;
  display: flex;
  align-items: flex-start;
}

.form-item.horizontal .label {
  flex-shrink: 0;
  display: inline-block;
  margin-right: 10px;
  width: var(--label-width);
}

.form-item.vertical {
  & .label {
    margin-bottom: 10px;
  }
}

.label {
  position: relative;
  padding-left: 12px;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
}

.form-item .label.required::before {
  position: absolute;
  left: 0;
  content: "*";
  color: red;
  margin-right: 5px;
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
