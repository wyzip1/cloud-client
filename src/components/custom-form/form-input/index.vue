<template>
  <view class="form-input-wrap">
    <t-input
      :type="type"
      class="form-input"
      :placeholder="placeholder"
      placeholder-style="font-size: calc(100vw / 750 * 28); color: #ccc;"
      :value="value"
      @blur="onChange"
      :disabled="disabled"
      :readonly="readonly"
    />
  </view>
</template>

<script>
import Input from "@youzan-open/tee-ui/src/input/index.vue";
import { setFormState, useFormWatch } from "../utils";

export default {
  name: "form-input",
  components: {
    "t-input": Input,
  },
  props: {
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
    useFormWatch(this.name, this, (value) => {
      this.value = value;
    });
  },
  methods: {
    onChange(e) {
      let detail = e.detail?.value || e.value;
      if (this.type === "number") {
        const [value] = detail.match(/\d+/g) || [];
        detail = value;
      }

      setFormState(this, { [this.name]: detail });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/global.scss";

.form-input-wrap {
  border: 1px solid #e1e1e1;
  height: rpx(80);
  border-radius: rpx(12);
  overflow: hidden;
}

.form-input {
  width: 100%;
  height: 100%;
  font-size: rpx(28);
  color: #1e1e1e;
  line-height: calc(rpx(40) - 2px);
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: 0;
  background-color: transparent;
  padding: rpx(12) rpx(24);

  input {
    min-height: unset;
  }
}

.form-input::placeholder,
.input-placeholder {
  font-size: rpx(28);
  color: #ccc;
}
</style>
