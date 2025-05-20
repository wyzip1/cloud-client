<template>
  <view>
    <wrap
      :key="name"
      :pid="pid"
      :rules="rules"
      :name="name"
      :customStyle="customStyle"
      :border="border"
      :showRequired="showRequired"
      :useLabelSlot="useLabelSlot"
      :label="label"
      :labelStyle="labelStyle"
      :valueStyle="valueStyle"
      :layout="layout"
      :labelWidth="labelWidth"
      :valueAlign="valueAlign"
      :labelAlign="labelAlign"
      :initValue="initValue"
    >
      <slot />
    </wrap>
  </view>
</template>

<script>
import wrap from "./wrap.vue";

export default {
  components: { wrap },
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
    return {};
  },
};
</script>
