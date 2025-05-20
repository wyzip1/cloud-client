<template>
  <view>
    <view
      :class="{ 'form-select': true, select: hasSelected }"
      @click="showSelect"
    >
      <text>{{ valueText }}</text>
      <t-icon class="icon" name="arrow" />
    </view>

    <select-popup
      :title="title || '请选择'"
      :value="value"
      :options="options"
      :mode="mode"
      :show="openSelect"
      @confirm="onChange"
      @close="hideSelect"
    />
  </view>
</template>

<script>
import { Icon } from "@youzan-cloud/tee-ui";
import SelectPopup from "../../select-popup.vue";

export default {
  components: {
    "t-icon": Icon,
    SelectPopup,
  },
  props: {
    pid: {
      type: String,
      default: "base",
    },
    name: String,

    title: String,
    options: Array,
    mode: {
      type: String,
      default: "checkbox",
    },
    placeholder: String,
  },
  computed: {
    hasSelected() {
      return this.value?.length > 0;
    },
    valueText() {
      return (
        this.value
          ?.map((v) => this.options.find((i) => i.value == v.value)?.label)
          .filter((v) => !!v)
          .join() ||
        this.placeholder ||
        "请选择"
      );
    },
  },
  data() {
    return {
      value: [],
      openSelect: false,
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
    showSelect() {
      this.openSelect = true;
    },
    hideSelect() {
      this.openSelect = false;
    },
    onChange(e) {
      this._parent.formChange(e.detail || e);
      this.hideSelect();
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
  align-items: center;
  justify-content: space-between;
}

.form-select.select {
  font-size: 14px;
  color: #333;
}

.icon {
  margin-left: 5px;
}
</style>
