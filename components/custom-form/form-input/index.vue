<template>
  <view class="form-input">
    <t-input
      :type="type"
      class="form-input"
      :placeholder="placeholder"
      placeholder-style="font-size: 14px; color: #dddddd;"
      :value="value"
      @blur="onChange"
      :disabled="disabled"
      :readonly="readonly"
    />
  </view>
</template>

<script>
import Input from "@youzan-open/tee-ui/src/input/index.vue";

export default {
  components: {
    "t-input": Input,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    type: {
      type: String,
      value: "text",
    },
    name: String,
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
  },
  data() {
    return { value: null };
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
      let detail = e.detail?.value || e.value;
      if (this.type === "number") {
        const [value] = detail.match(/\d+/g) || [];
        detail = value;
      }
      this._parent.formChange(detail);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-input {
  width: 100%;
  font-size: 14px;
  border: none;
  outline: none;
  height: 20px;
  box-sizing: border-box;

  input {
    height: 20px;
    min-height: unset;
  }
}

.form-input::placeholder,
.input-placeholder {
  font-size: 12px;
  color: #dddddd;
}
</style>
