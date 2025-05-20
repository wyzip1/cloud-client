<template>
  <view>
    <t-checkbox-group :pid="name" :value="value || []" @change="onChange">
      <view :class="['form-checkbox-group', layout]">
        <t-checkbox
          v-for="item in options"
          :key="item.value"
          shape="square"
          icon-class="checkbox"
          checked-color="#d80f18"
          :pid="name"
          :disabled="item.disabled"
          :name="item.value"
        >
          {{ item.label }}
        </t-checkbox>
      </view>
    </t-checkbox-group>
  </view>
</template>

<script>
import { Checkbox, CheckboxGroup } from "@youzan-cloud/tee-ui";
export default {
  components: {
    "t-checkbox-group": CheckboxGroup,
    "t-checkbox": Checkbox,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,
    layout: {
      type: String,
      default: "horizontal",
    },
    options: Array,
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
    onChange(list) {
      this.$emit("before-change", (format) => {
        list = typeof format === "function" ? format(list) : list;
      });
      this._parent.formChange(list);
      this.$emit("change", list);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-checkbox-group {
  display: flex;
  gap: 10px;

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

  .checkbox {
    border-radius: 0px !important;
  }
}
</style>
