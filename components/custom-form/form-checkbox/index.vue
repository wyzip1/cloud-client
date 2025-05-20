<template>
  <view class="form-checkbox">
    <t-checkbox
      shape="square"
      icon-class="checkbox"
      checked-color="#d80f18"
      :value="value"
      @change="onChange()"
    >
      <slot />
    </t-checkbox>
  </view>
</template>

<script>
import { Checkbox } from "@youzan-cloud/tee-ui";
export default {
  components: {
    "t-checkbox": Checkbox,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
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
  data() {
    return {
      value: null,
    };
  },
  methods: {
    onChange() {
      this._parent.formChange(!this.value);
      this.$emit("change", !this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-checkbox {
  .checkbox {
    border-radius: 0px !important;
  }
}
</style>
