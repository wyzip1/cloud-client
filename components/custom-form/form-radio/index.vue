<template>
  <view :class="['form-radio', layout]">
    <t-checkbox
      :checked-color="color || '#d80f18'"
      :shape="shape"
      icon-class="checkbox"
      v-for="item in options"
      :key="item.value"
      :value="item.value === value"
      :disabled="disabled"
      @change="onChange(item)"
    >
      {{ item.label }}
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
    color: String,
    shape: String,
    name: String,
    layout: {
      type: String,
      default: "horizontal",
    },
    options: Array,
    disabled: Boolean,
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
    onChange(item) {
      this._parent.formChange(item.value);
      this.$emit("change", item.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-radio {
  display: flex;
  gap: 10px;

  .checkbox {
    border-radius: 0px !important;
  }

  &.horizontal {
    flex-wrap: wrap;
    white-space: nowrap;
    align-items: center;
  }

  &.vertical {
    &.vertical {
      flex-direction: column;
    }
  }
}
</style>
